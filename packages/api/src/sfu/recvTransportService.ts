import { postToServer } from "./serverService";
import type { ConnectionInfo, Routes } from "../../../types";
import {
  deleteRecvTransport,
  createRecvTransport,
} from "../db/repositories/recvTransportRepository";
import { RequestContext } from "../io/types";
import { getAllSettledValues } from "../io/promises";
import { patchConnection } from "../db/repositories/connectionRepository";
import { closeConsumer } from "./streamConsumerService";
import { Connection } from "../db/types/connection";

interface InitRecvTransportEvent {
  connectionId: string;
  data: Routes["/connect/init"]["in"];
}

export async function onInitRecvTransport(
  event: InitRecvTransportEvent
): Promise<ConnectionInfo> {
  const { connectionId, data } = event;

  if (data.type !== "recv") {
    throw new Error("onInitRecvTransport: type should be recv");
  }

  const connectionInfo = await postToServer("/connect/init", data);

  // TODO: Handle connection removed in between
  await Promise.all([
    patchConnection({
      connectionId,
      recvTransportId: connectionInfo.transportId,
    }),
    createRecvTransport({ transportId: connectionInfo.transportId }),
  ]);

  return connectionInfo;
}

interface ConnectRecvTransportEvent {
  connectionId: string;
  data: Routes["/connect/create"]["in"];
}

export async function onConnectRecvTransport(
  event: ConnectRecvTransportEvent
): Promise<Routes["/connect/create"]["out"]> {
  return postToServer("/connect/create", event.data);
}

interface OnRecvTransportCloseEvent {
  connectionId: string;
  transportId: string;
  requestContext: RequestContext;
}

export async function onRecvTransportClose(
  event: OnRecvTransportCloseEvent
): Promise<void> {
  await closeRecvTransport({ ...event, skipConnectionPatch: false });
}

interface CloseRecvTransportParams {
  connectionId: string;
  transportId: string | null;
  requestContext: RequestContext;
  skipConnectionPatch: boolean;
}

export async function closeRecvTransport(
  params: CloseRecvTransportParams
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
    deleteRecvTransport({ transportId: params.transportId }),
    // No need to destroy mediasoup consumer as it will be done automatically when closing transport
    closeConsumer({
      transportId: params.transportId,
      destroy: false,
      consumerId: null,
    }),
    params.skipConnectionPatch
      ? Promise.resolve(null)
      : patchConnection({
          connectionId: params.connectionId,
          recvTransportId: null,
        }),
  ]);

  getAllSettledValues<void | null | Connection>(
    results,
    "closeRecvTransportClose: Unexpected error"
  );
}
