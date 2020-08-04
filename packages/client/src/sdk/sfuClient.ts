import { get, post } from "./request";
import { Device, types } from "mediasoup-client";
import {
  InitConnectionParams,
  ConnectionInfo,
  ConnectParams,
  SendParams,
  ReceiveInfo,
  ReceiveParams,
  ConsumerInfo,
} from "../../../server/src/sfu/types";
import { Settings } from "../types";
import { sendMessage, createWebSocket } from "./websocket";

export function createDevice(): types.Device {
  const device = new Device();

  return device;
}

export async function loadDevice(
  settings: Settings,
  device: types.Device
): Promise<void> {
  const ws = await createWebSocket();
  const routerRtpCapabilities = await sendMessage<types.RtpCapabilities>(
    ws,
    "/sfu/router-capabilities",
    settings,
    null
  );

  await device.load({ routerRtpCapabilities });
}

export async function createTransport(
  settings: Settings,
  device: Device,
  type: "send" | "recv"
): Promise<types.Transport> {
  if (!device.loaded) {
    throw new Error("createTransport: Device must be loaded");
  }

  const request: InitConnectionParams = {
    sctpCapabilities: device.sctpCapabilities,
  };

  const {
    transportId,
    iceParameters,
    iceCandidates,
    dtlsParameters,
    sctpParameters,
  } = await post<ConnectionInfo>(settings, "/connect/init", request);

  const params = {
    id: transportId,
    iceParameters,
    iceCandidates: iceCandidates as types.IceCandidate[],
    dtlsParameters,
    sctpParameters,
    iceServers: [],
  };

  const transport =
    type === "send"
      ? device.createSendTransport(params)
      : device.createRecvTransport(params);

  transport.on("connect", async ({ dtlsParameters }, callback, errback) => {
    try {
      const connectParams: ConnectParams = { transportId, dtlsParameters };
      await post<void>(settings, `/connect/create`, connectParams);
      callback();
    } catch (e) {
      errback(e);
    }
  });

  transport.on("connectionstatechange", (e) => {
    console.log("transport connection changed", e);
  });

  if (type === "send") {
    transport.on(
      "produce",
      async ({ kind, rtpParameters }, callback, errback) => {
        try {
          const req: SendParams = {
            transportId,
            kind,
            rtpParameters,
          };

          const producerId = await post(settings, `/send/create`, req);

          callback({ id: producerId });
        } catch (error) {
          errback(error);
        }
      }
    );
  }

  return transport;
}

async function createVideoProducer(
  transport: types.Transport,
  stream: MediaStream
): Promise<types.Producer | null> {
  const track = stream.getVideoTracks()[0] ?? null;

  if (track === null) {
    return null;
  }

  return transport.produce({
    track,
    codecOptions: {
      videoGoogleStartBitrate: 1000,
      videoGoogleMaxBitrate: 2000000,
    },
    disableTrackOnPause: true,
    encodings: [
      { scaleResolutionDownBy: 4, maxBitrate: 500000 },
      { scaleResolutionDownBy: 2, maxBitrate: 1000000 },
      { scaleResolutionDownBy: 1, maxBitrate: 2000000 },
    ],
  });
}

async function createAudioProducer(
  transport: types.Transport,
  stream: MediaStream
): Promise<types.Producer | null> {
  const track = stream.getAudioTracks()[0] ?? null;

  if (track === null) {
    return null;
  }

  return transport.produce({
    track,
  });
}

export async function sendStream(
  transport: types.Transport,
  stream: MediaStream
): Promise<{ audio: types.Producer | null; video: types.Producer | null }> {
  const [audio, video] = await Promise.all([
    createAudioProducer(transport, stream),
    createVideoProducer(transport, stream),
  ]);

  return {
    audio,
    video,
  };
}

const consumers: Map<string, types.Consumer> = new Map();
const consumerStreams: Map<string, MediaStream> = new Map();

async function createConsumer(
  settings: Settings,
  transport: types.Transport,
  info: ConsumerInfo
): Promise<types.Consumer> {
  const cachedConsumer = consumers.get(info.consumerId);
  if (cachedConsumer) {
    return cachedConsumer;
  }

  const consumer = await transport.consume({
    id: info.consumerId,
    producerId: info.producerId,
    kind: info.kind,
    rtpParameters: info.rtpParameters,
  });

  consumers.set(consumer.id, consumer);

  await post<void>(settings, `/receive/play`, { consumerId: info.consumerId });
  consumer.resume();

  return consumer;
}

async function createRecvMediaStream(
  settings: Settings,
  producerUserId: string,
  transport: types.Transport,
  infos: ConsumerInfo[]
): Promise<[string, MediaStream]> {
  const stream = consumerStreams.get(producerUserId) ?? new MediaStream();
  consumerStreams.set(producerUserId, stream);

  const consumers = await Promise.all(
    infos.map((info) => createConsumer(settings, transport, info))
  );

  consumers.forEach(({ track }) => {
    if (!stream.getTrackById(track.id)) {
      stream.addTrack(track);
    }
  });

  return [producerUserId, stream];
}

export async function recvStreams(
  settings: Settings,
  device: types.Device,
  transport: types.Transport
): Promise<{ [connectionId: string]: MediaStream }> {
  const req: ReceiveParams = {
    transportId: transport.id,
    rtpCapabilities: device.rtpCapabilities,
  };

  const info = await post<ReceiveInfo>(settings, "/receive/create", req);

  const tasks: Array<Promise<[string, MediaStream]>> = [];
  for (const [producerUserId, consumersInfos] of Object.entries(info)) {
    tasks.push(
      createRecvMediaStream(settings, producerUserId, transport, consumersInfos)
    );
  }

  return Object.fromEntries(await Promise.all(tasks));
}
