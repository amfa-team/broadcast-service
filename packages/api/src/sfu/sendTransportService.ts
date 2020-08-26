import { postToServer } from "./serverService";
import type { ConnectionInfo, Routes } from "../../../types";
import { patchConnection } from "../db/repositories/connectionRepository";
import { deleteSendTransport } from "../db/repositories/sendTransportRepository";
import { broadcastToConnections } from "../io/io";
import { RequestContext } from "../io/types";
import { getAllSettledValues } from "../io/promises";

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
  await patchConnection({
    connectionId,
    sendTransportId: connectionInfo.transportId,
  });

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
  requestContext: RequestContext;
}

export async function onSendTransportClose(
  event: OnSendTransportCloseEvent
): Promise<void> {
  await closeSendTransport(event);
}

interface CloseSendTransportParams {
  connectionId: string;
  transportId: string | null;
  requestContext: RequestContext;
}

export async function closeSendTransport(
  params: CloseSendTransportParams
): Promise<void> {
  if (params.transportId == null) {
    return;
  }

  const results = await Promise.allSettled([
    await postToServer("/connect/destroy", { transportId: params.transportId }),
    deleteSendTransport({ transportId: params.transportId }),
    broadcastToConnections(
      params.requestContext,
      JSON.stringify({
        type: "event",
        payload: {
          type: "stream:remove",
          data: params.transportId,
        },
      })
    ),
  ]);

  getAllSettledValues(results, "closeSendTransport: Unexpected error");
}
