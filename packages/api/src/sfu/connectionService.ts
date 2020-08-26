import {
  createConnection,
  getConnection,
  deleteConnection,
} from "../db/repositories/connectionRepository";
import { requestServer } from "./serverService";
import type { Routes } from "../../../types";
import { RequestContext } from "../io/types";
import { getAllSettledValues } from "../io/promises";
import {
  onSendTransportClose,
  closeSendTransport,
} from "./sendTransportService";
import {
  onRecvTransportClose,
  closeRecvTransportClose,
} from "./recvTransportService";

interface ConnectEvent {
  connectionId: string;
  token: string;
}

export async function onConnect(
  event: ConnectEvent
): Promise<Routes["/router-capabilities"]["out"]> {
  await createConnection(event);

  const routerCapabilities = await requestServer<"/router-capabilities">(
    "/router-capabilities",
    null
  );

  return routerCapabilities;
}

export function onPing(): string {
  return "pong";
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

  await deleteConnection({ connectionId });

  const results = await Promise.allSettled([
    closeSendTransport({
      connectionId,
      requestContext,
      transportId: connection?.sendTransportId ?? null,
    }),
    closeRecvTransportClose({
      connectionId,
      requestContext,
      transportId: connection?.recvTransportId ?? null,
    }),
  ]);

  getAllSettledValues(results, "onDisconnect: Unexpected error");
}
