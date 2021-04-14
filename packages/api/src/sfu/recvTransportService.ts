import type {
  Connection,
  ConnectionInfo,
  Routes,
} from "@amfa-team/broadcast-service-types";
import {
  findConnectionByRecvTransportId,
  patchConnection,
} from "../db/repositories/connectionRepository";
import {
  createRecvTransport,
  deleteRecvTransport,
} from "../db/repositories/recvTransportRepository";
import { getAllSettledValues } from "../io/promises";
import { postToServer } from "./serverService";
import { closeConsumer } from "./streamConsumerService";

interface InitRecvTransportEvent {
  connectionId: string;
  data: Routes["/connect/init"]["in"];
}

export async function onInitRecvTransport(
  event: InitRecvTransportEvent,
): Promise<ConnectionInfo> {
  const { connectionId, data } = event;

  if (data.type !== "recv") {
    throw new Error("onInitRecvTransport: type should be recv");
  }

  const connectionInfo = await postToServer("/connect/init", data);

  // TODO: Handle connection removed in between
  await Promise.all([
    patchConnection({
      _id: connectionId,
      recvTransportId: connectionInfo.transportId,
    }),
    createRecvTransport({ _id: connectionInfo.transportId }),
  ]);

  return connectionInfo;
}

interface ConnectRecvTransportEvent {
  connectionId: string;
  data: Routes["/connect/create"]["in"];
}

export async function onConnectRecvTransport(
  event: ConnectRecvTransportEvent,
): Promise<Routes["/connect/create"]["out"]> {
  return postToServer("/connect/create", event.data);
}

interface OnRecvTransportCloseEvent {
  connectionId: string;
  transportId: string;
}

interface CloseRecvTransportParams {
  connectionId: string;
  transportId: string | null;
  skipConnectionPatch: boolean;
}

export async function closeRecvTransport(
  params: CloseRecvTransportParams,
): Promise<void> {
  if (params.transportId == null) {
    return;
  }

  const results = await Promise.allSettled([
    // Keep mediasoup resources for 30s as we might have pending requests
    // We don't want to have mediasoup in sync, as API is the source of trust
    // So we don't want to have mediasoup resources removed before API side (hello concurrency hell)
    // Moreover this could help in future to cancel destroy in case of reconnect
    postToServer("/connect/destroy", {
      transportId: params.transportId,
      delay: 30000,
    }),
    deleteRecvTransport({ _id: params.transportId }),
    // No need to destroy mediasoup consumer as it will be done automatically when closing transport
    closeConsumer({
      transportId: params.transportId,
      destroy: false,
      consumerId: null,
    }),
    params.skipConnectionPatch
      ? Promise.resolve(null)
      : patchConnection({
          _id: params.connectionId,
          recvTransportId: null,
        }),
  ]);

  getAllSettledValues<void | null | Connection>(
    results,
    "closeRecvTransportClose: Unexpected error",
  );
}

export async function cleanupRecvTransport(transportId: string): Promise<void> {
  const connection = await findConnectionByRecvTransportId(transportId);

  await Promise.all(
    connection.map(async (c) =>
      closeRecvTransport({
        connectionId: c._id,
        transportId,
        skipConnectionPatch: false,
      }),
    ),
  );
}

export async function onRecvTransportClose(
  event: OnRecvTransportCloseEvent,
): Promise<void> {
  await closeRecvTransport({ ...event, skipConnectionPatch: false });
}
