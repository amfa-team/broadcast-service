import type {
  Connection,
  ConnectionInfo,
  Routes,
} from "@amfa-team/broadcast-service-types";
import {
  findConnectionBySendTransportId,
  patchConnection,
} from "../db/repositories/connectionRepository";
import {
  createSendTransport,
  deleteSendTransport,
} from "../db/repositories/sendTransportRepository";
import { getAllSettledValues } from "../io/promises";
import { postToServer } from "./serverService";
import { closeStream } from "./streamService";

interface InitSendTransportEvent {
  connectionId: string;
  data: Routes["/connect/init"]["in"];
}

export async function onInitSendTransport(
  event: InitSendTransportEvent,
): Promise<ConnectionInfo> {
  const { connectionId, data } = event;

  if (data.type !== "send") {
    throw new Error("onInitSendTransport: type should be send");
  }

  const connectionInfo = await postToServer("/connect/init", data);

  // TODO: Handle connection removed in between
  await Promise.all([
    patchConnection({
      _id: connectionId,
      sendTransportId: connectionInfo.transportId,
    }),
    createSendTransport({ _id: connectionInfo.transportId }),
  ]);

  return connectionInfo;
}

interface ConnectSendTransportEvent {
  connectionId: string;
  data: Routes["/connect/create"]["in"];
}

export async function onConnectSendTransport(
  event: ConnectSendTransportEvent,
): Promise<Routes["/connect/create"]["out"]> {
  return postToServer("/connect/create", event.data);
}

interface CloseSendTransportParams {
  connectionId: string;
  transportId: string | null;
  skipConnectionPatch: boolean;
}

export async function closeSendTransport(
  params: CloseSendTransportParams,
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
    deleteSendTransport({ _id: params.transportId }),
    closeStream({
      transportId: params.transportId,
      producerId: null,
      destroy: false,
    }),
    params.skipConnectionPatch
      ? Promise.resolve(null)
      : patchConnection({
          _id: params.connectionId,
          sendTransportId: null,
        }),
  ]);

  getAllSettledValues<void | null | Connection>(
    results,
    "closeSendTransport: Unexpected error",
  );
}

export async function cleanupSendTransport(transportId: string): Promise<void> {
  const connection = await findConnectionBySendTransportId(transportId);

  await Promise.all(
    connection.map(async (c) =>
      closeSendTransport({
        connectionId: c._id,
        transportId,
        skipConnectionPatch: false,
      }),
    ),
  );
}
interface OnSendTransportCloseEvent {
  connectionId: string;
  transportId: string;
}

export async function onSendTransportClose(
  event: OnSendTransportCloseEvent,
): Promise<void> {
  await closeSendTransport({ ...event, skipConnectionPatch: false });
}
