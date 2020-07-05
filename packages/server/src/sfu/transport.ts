import { types } from "mediasoup";
import { getRouter } from "./routers";

const transports: Map<string, types.WebRtcTransport> = new Map();

const WEB_RTC_TRANSPORT_OPTIONS = {
  listenIps: [
    {
      ip: "127.0.0.1",
      announcedIp: "127.0.0.1", // TODO: env-vars
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
