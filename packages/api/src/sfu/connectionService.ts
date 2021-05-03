import type { Connection, Routes } from "@amfa-team/broadcast-service-types";
import {
  createConnection,
  deleteConnection,
  getConnection,
  getConnectionsByToken,
} from "../db/repositories/connectionRepository";
import { getAllSettledValues } from "../io/promises";
import { closeRecvTransport } from "./recvTransportService";
import { closeSendTransport } from "./sendTransportService";
import { requestServer } from "./serverService";

interface ConnectEvent {
  connectionId: string;
  token: string;
}

interface CloseConnectionParams {
  connection: Connection | null;
}

export async function closeConnection(
  params: CloseConnectionParams,
): Promise<void> {
  const { connection } = params;

  if (connection == null) {
    return;
  }

  const results = await Promise.allSettled([
    deleteConnection({ _id: connection._id }),
    closeSendTransport({
      connectionId: connection._id,
      transportId: connection.sendTransportId ?? null,
      skipConnectionPatch: true, // not needed as we remove the connection
    }),
    closeRecvTransport({
      connectionId: connection._id,
      transportId: connection.recvTransportId ?? null,
      skipConnectionPatch: true, // not needed as we remove the connection
    }),
  ]);

  getAllSettledValues(results, "onDisconnect: Unexpected error");
}

// async function removeOldConnections(event: ConnectEvent): Promise<void> {
//   const { connectionId, token } = event;
//   const connections = await getConnectionsByToken({ token });

//   const results = await Promise.allSettled(
//     connections
//       .filter((c) => c._id !== connectionId)
//       .map(async (c) => closeConnection({ connection: c })),
//   );

//   getAllSettledValues(results, "removeOldConnections: Unexpected error");
// }

export async function onConnect(
  event: ConnectEvent,
): Promise<Routes["/router-capabilities"]["out"]> {
  const [routerCapabilities] = await Promise.all([
    requestServer<"/router-capabilities">("/router-capabilities", null),
    createConnection({ _id: event.connectionId, token: event.token }),
    // removeOldConnections(event),
  ]);

  return routerCapabilities;
}

interface RefreshConnectionEvent {
  connectionId: string;
  token: string;
}

// Refresh is done with a new connection to overcome AWS 2hours hard limit
export async function onRefreshConnection(
  event: RefreshConnectionEvent,
): Promise<boolean> {
  const { connectionId, token } = event;
  const connections = await getConnectionsByToken({ token });

  if (connections.length !== 1) {
    // We expect to have only one connection
    return false;
  }

  const oldConnection = connections[0];

  await Promise.allSettled([
    createConnection({ ...oldConnection, _id: connectionId }),
    deleteConnection({ _id: oldConnection._id }),
  ]);

  return true;
}

export function onPing(): string {
  return "pong";
}

interface DisconnectEvent {
  connectionId: string;
}

// There is 2 types of disconnect clean & unclean
//    - clean: client or server close explicitly
//    - unclean: network errors, client crash...
// TODO: handle clean disconnect on websocket timeout (i.e. 2 hours) without cutting the stream
// TODO: handle reconnect after unclean (client crash)
// TODO: handle disconnect (pause stream?) when unclean disconnect (idle timeout is 10min)
// TODO: prevent idle timeout by sending ping
export async function onDisconnect(event: DisconnectEvent): Promise<void> {
  const { connectionId } = event;

  // TODO: do not destroy directly the transport
  // Try to handle reconnect via a new websocket for 30s?

  const connection = await getConnection({ _id: connectionId });
  await closeConnection({ connection });
}
