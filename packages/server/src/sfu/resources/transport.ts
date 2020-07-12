import { types } from "mediasoup";

type TransportMeta = {
  routerId: string;
  userId: string;
};

const transports: Map<string, types.WebRtcTransport> = new Map();
const transportsMeta: WeakMap<
  types.WebRtcTransport,
  TransportMeta
> = new WeakMap();

export async function createTransport(
  router: types.Router,
  userId: string,
  sctpCapabilities: types.SctpCapabilities
): Promise<types.WebRtcTransport> {
  const transport = await router.createWebRtcTransport({
    listenIps: [
      {
        ip: process.env.LISTEN_IP ?? "0.0.0.0",
        announcedIp: process.env.PUBLIC_IP,
      },
    ],
    initialAvailableOutgoingBitrate: 1000000,
    numSctpStreams: sctpCapabilities.numStreams,
  });

  transports.set(transport.id, transport);

  transport.on("routerclose", () => {
    transports.delete(transport.id);
    console.log("router closed so transport closed");
  });

  transport.observer.on("close", () => {
    transports.delete(transport.id);
  });

  transportsMeta.set(transport, { routerId: router.id, userId });

  return transport;
}

export function getTransport(transportId: string): types.WebRtcTransport {
  const transport = transports.get(transportId);

  if (transport == null) {
    throw new Error("transport not found or deleted");
  }

  return transport;
}

export function getTransports(): types.WebRtcTransport[] {
  return [...transports.values()];
}

export function getTransportMeta(transportId: string): TransportMeta {
  const transport = getTransport(transportId);
  const meta = transportsMeta.get(transport);

  if (meta == null) {
    throw new Error("transport meta not found or deleted");
  }

  return meta;
}

export function getTransportUsage(): { [routerId: string]: number } {
  const usage: { [routerId: string]: number } = {};

  for (const transportId of transports.keys()) {
    const { routerId } = getTransportMeta(transportId);
    const count = usage[routerId] ?? 0;
    usage[routerId] = count + 1;
  }

  return usage;
}

export async function connectTransport(
  transportId: string,
  dtlsParameters: types.DtlsParameters
): Promise<types.WebRtcTransport> {
  const transport = getTransport(transportId);
  await transport.connect({ dtlsParameters });

  return transport;
}

export function getRouterTransports(router: types.Router): types.Transport[] {
  return [...transports.values()].filter(
    (transport) => getTransportMeta(transport.id).routerId === router.id
  );
}
