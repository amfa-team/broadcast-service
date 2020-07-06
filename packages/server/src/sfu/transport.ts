import { types } from "mediasoup";
import { getRouter } from "./routers";

const transports: Map<string, types.WebRtcTransport> = new Map();

const WEB_RTC_TRANSPORT_OPTIONS = {
  listenIps: [
    {
      ip: "0.0.0.0",
      announcedIp: process.env.PUBLIC_IP, // TODO: env-vars
    },
  ],
  initialAvailableOutgoingBitrate: 1000000,
};

export async function createTransport(
  routerId: string,
  sctpCapabilities: types.SctpCapabilities
): Promise<types.WebRtcTransport> {
  const router = getRouter(routerId);
  const transport = await router.createWebRtcTransport({
    ...WEB_RTC_TRANSPORT_OPTIONS,
    numSctpStreams: sctpCapabilities.numStreams,
  });

  transports.set(transport.id, transport);

  transport.on("routerclose", () => {
    transports.delete(transport.id);
    console.log("router closed so transport closed");
  });

  return transport;
}

export function getTransport(transportId: string): types.WebRtcTransport {
  const transport = transports.get(transportId);

  if (transport == null) {
    throw new Error("transport not found or deleted");
  }

  return transport;
}

export async function connectTransport(
  transportId: string,
  dtlsParameters: types.DtlsParameters
): Promise<types.WebRtcTransport> {
  const transport = getTransport(transportId);
  await transport.connect({ dtlsParameters });

  return transport;
}
