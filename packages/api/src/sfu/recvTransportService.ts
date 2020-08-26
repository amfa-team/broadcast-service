import { postToServer } from "./serverService";
import type { ConnectionInfo, Routes } from "../../../types";
import { deleteRecvTransport } from "../db/repositories/recvTransportRepository";
import { RequestContext } from "../io/types";
import { deleteStreamConsumerByTransportId } from "../db/repositories/streamConsumerRepository";
import { getAllSettledValues } from "../io/promises";
import { patchConnection } from "../db/repositories/connectionRepository";

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
  await patchConnection({
    connectionId,
    recvTransportId: connectionInfo.transportId,
  });

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
  await closeRecvTransportClose(event);
}

interface CloseRecvTransportParams {
  connectionId: string;
  transportId: string | null;
  requestContext: RequestContext;
}

export async function closeRecvTransportClose(
  params: CloseRecvTransportParams
): Promise<void> {
  if (params.transportId == null) {
    return;
  }

  const results = await Promise.allSettled([
    await postToServer("/connect/destroy", { transportId: params.transportId }),
    deleteRecvTransport({ transportId: params.transportId }),
    // No need to destroy mediasoup consumer as it will be done automatically when closing transport
    deleteStreamConsumerByTransportId(params.transportId),
  ]);

  getAllSettledValues(results, "closeRecvTransportClose: Unexpected error");
}
