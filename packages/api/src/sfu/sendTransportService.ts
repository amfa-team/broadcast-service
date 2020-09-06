import { postToServer } from "./serverService";
import type { ConnectionInfo, Routes } from "../../../types";
import { patchConnection } from "../db/repositories/connectionRepository";
import {
  deleteSendTransport,
  createSendTransport,
} from "../db/repositories/sendTransportRepository";
import { getAllSettledValues } from "../io/promises";
import { closeStream } from "./streamService";
import { Connection } from "../db/types/connection";

interface InitSendTransportEvent {
  connectionId: string;
  data: Routes["/connect/init"]["in"];
}

export async function onInitSendTransport(
  event: InitSendTransportEvent
): Promise<ConnectionInfo> {
  const { connectionId, data } = event;

  if (data.type !== "send") {
    throw new Error("onInitSendTransport: type should be send");
  }

  const connectionInfo = await postToServer("/connect/init", data);

  // TODO: Handle connection removed in between
  await Promise.all([
    patchConnection({
      connectionId,
      sendTransportId: connectionInfo.transportId,
    }),
    createSendTransport({ transportId: connectionInfo.transportId }),
  ]);

  return connectionInfo;
}

interface ConnectSendTransportEvent {
  connectionId: string;
  data: Routes["/connect/create"]["in"];
}

export async function onConnectSendTransport(
  event: ConnectSendTransportEvent
): Promise<Routes["/connect/create"]["out"]> {
  return postToServer("/connect/create", event.data);
}

interface OnSendTransportCloseEvent {
  connectionId: string;
  transportId: string;
}

export async function onSendTransportClose(
  event: OnSendTransportCloseEvent
): Promise<void> {
  await closeSendTransport({ ...event, skipConnectionPatch: false });
}

interface CloseSendTransportParams {
  connectionId: string;
  transportId: string | null;
  skipConnectionPatch: boolean;
}

export async function closeSendTransport(
  params: CloseSendTransportParams
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
    deleteSendTransport({ transportId: params.transportId }),
    closeStream({
      transportId: params.transportId,
      producerId: null,
      destroy: false,
    }),
    params.skipConnectionPatch
      ? Promise.resolve(null)
      : patchConnection({
          connectionId: params.connectionId,
          sendTransportId: null,
        }),
  ]);

  getAllSettledValues<void | null | Connection>(
    results,
    "closeSendTransport: Unexpected error"
  );
}
