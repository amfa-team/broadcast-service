import {
  createConnection,
  getConnection,
  deleteConnection,
  getConnectionsByToken,
} from "../db/repositories/connectionRepository";
import { requestServer } from "./serverService";
import type { Routes } from "../../../types";
import { RequestContext } from "../io/types";
import { getAllSettledValues } from "../io/promises";
import { closeSendTransport } from "./sendTransportService";
import { closeRecvTransport } from "./recvTransportService";
import { Connection } from "../db/types/connection";

interface ConnectEvent {
  connectionId: string;
  token: string;
  requestContext: RequestContext;
}

export async function onConnect(
  event: ConnectEvent
): Promise<Routes["/router-capabilities"]["out"]> {
  const [routerCapabilities] = await Promise.all([
    requestServer<"/router-capabilities">("/router-capabilities", null),
    createConnection(event),
    removeOldConnections(event),
  ]);

  return routerCapabilities;
}

async function removeOldConnections(event: ConnectEvent): Promise<void> {
  const { connectionId, token, requestContext } = event;
  const connections = await getConnectionsByToken({ token });

  const results = await Promise.allSettled(
    connections
      .filter((c) => c.connectionId !== connectionId)
      .map((c) => closeConnection({ connection: c, requestContext }))
  );

  getAllSettledValues(results, "removeOldConnections: Unexpected error");
}

export function onPing(): string {
  return "pong";
}

interface CloseConnectionParams {
  connection: Connection | null;
  requestContext: RequestContext;
}

async function closeConnection(params: CloseConnectionParams): Promise<void> {
  const { connection, requestContext } = params;

  if (connection == null) {
    return;
  }

  const results = await Promise.allSettled([
    deleteConnection({ connectionId: connection.connectionId }),
    closeSendTransport({
      connectionId: connection.connectionId,
      requestContext,
      transportId: connection?.sendTransportId ?? null,
      skipConnectionPatch: true, // not needed as we remove the connection
    }),
    closeRecvTransport({
      connectionId: connection.connectionId,
      requestContext,
      transportId: connection?.recvTransportId ?? null,
      skipConnectionPatch: true, // not needed as we remove the connection
    }),
  ]);

  getAllSettledValues(results, "onDisconnect: Unexpected error");
}

interface DisconnectEvent {
  connectionId: string;
  requestContext: RequestContext;
}

// There is 2 types of disconnect clean & unclean
//    - clean: client or server close explicitly
//    - unclean: network errors, client crash...
// TODO: handle clean disconnect on websocket timeout (i.e. 2 hours) without cutting the stream
// TODO: handle reconnect after unclean (client crash)
// TODO: handle disconnect (pause stream?) when unclean disconnect (idle timeout is 10min)
// TODO: prevent idle timeout by sending ping
export async function onDisconnect(event: DisconnectEvent): Promise<void> {
  const { requestContext, connectionId } = event;

  // TODO: do not destroy directly the transport
  // Try to handle reconnect via a new websocket for 30s?

  const connection = await getConnection({ connectionId });
  await closeConnection({ connection, requestContext });
}
