import {
  createConnection,
  deleteConnection,
  findByConnectionId,
  updateConnection,
} from "../db/repositories/connectionRepository";
import { postToSFU } from "./pipeToSFU";
import {
  deleteByTransportId,
  createStream,
} from "../db/repositories/streamRepository";
import {
  deleteStreamConsumerByTransportId,
  createStreamConsumer,
} from "../db/repositories/streamConsumerRepository";
import { broadcastToConnections } from "../io/io";
import { getAllSettledValues } from "../io/promises";
import {
  ConnectionInfo,
  InitConnectionParams,
  SendParams,
  ReceiveParams,
  ConsumerInfo,
} from "../../../types";

interface OnNewConnectionEvent {
  connectionId: string;
  token: string;
}

export async function onNewConnection(
  event: OnNewConnectionEvent
): Promise<void> {
  await createConnection(event);
}

export async function closeTransport(
  transportId: string | null | void,
  type: "send" | "recv"
): Promise<void> {
  if (transportId == null) {
    return;
  }

  const results = await Promise.allSettled([
    postToSFU<null>("/connect/destroy", { transportId }),
    deleteByTransportId(transportId),
    type === "send"
      ? broadcastToConnections(
          JSON.stringify({
            type: "event",
            payload: {
              type: "stream:remove",
              data: transportId,
            },
          })
        )
      : // No need to destroy mediasoup consumer as it will be done automatically when closing transport
        deleteStreamConsumerByTransportId(transportId),
  ]);

  getAllSettledValues(results, "closeTransport: Unexpected error");
}

export async function onDisconnect(connectionId: string): Promise<void> {
  // TODO: do not destroy directly the transport
  // Try to handle reconnect via a new websocket for 30s?

  const connection = await findByConnectionId(connectionId);

  await deleteConnection(connectionId);

  const results = await Promise.allSettled([
    closeTransport(connection?.sendTransportId, "send"),
    closeTransport(connection?.recvTransportId, "recv"),
  ]);

  getAllSettledValues(results, "onDisconnect: Unexpected error");
}

export async function onRequestNewTransport(
  connectionId: string,
  data: InitConnectionParams
): Promise<ConnectionInfo> {
  const payload = await postToSFU<ConnectionInfo>("/connect/init", data);

  const transportIdField =
    data.type === "send" ? "sendTransportId" : "recvTransportId";

  // TODO: Handle connection removed in between
  await updateConnection({
    connectionId,
    [transportIdField]: payload.transportId,
  });

  return payload;
}

export async function onCreateStream(
  connectionId: string,
  data: SendParams
): Promise<string> {
  const connection = await findByConnectionId(connectionId);
  if (connection === null || connection.sendTransportId === null) {
    throw new Error(
      "onCreateStream: connection or sendTransportId does not exists"
    );
  }

  const producerId = await postToSFU<string>("/send/create", {
    ...data,
    // Force transportId for security reasons
    transportId: connection.sendTransportId,
  });

  // TODO: if exists?
  const stream = {
    transportId: connection.sendTransportId,
    producerId: producerId,
    kind: data.kind,
  };

  // TODO: Handle connection/transport removed in between
  await createStream(stream);

  broadcastToConnections(
    JSON.stringify({
      type: "event",
      payload: {
        type: "stream:add",
        data: stream,
      },
    })
  );

  return producerId;
}

export async function onCreateConsumerStream(
  connectionId: string,
  data: ReceiveParams
): Promise<ConsumerInfo> {
  const connection = await findByConnectionId(connectionId);
  if (connection === null || connection.recvTransportId === null) {
    throw new Error(
      "onCreateStream: connection or recvTransportId does not exists"
    );
  }
  // TODO: sourceTransportId does not exists anymore

  const payload = await postToSFU<ConsumerInfo>("/receive/create", {
    ...data,
    // Force transportId for security reasons
    transportId: connection.recvTransportId,
  });

  // TODO: If stream exists
  // TODO: Check permissions (sourceTransportId matches)
  const stream = {
    connectionId,
    transportId: connection.recvTransportId,
    sourceTransportId: data.sourceTransportId,
    producerId: data.producerId,
    consumerId: payload.consumerId,
  };

  // TODO: Handle connection/transport/producer removed in between
  await createStreamConsumer(stream);

  return payload;
}