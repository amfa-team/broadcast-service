import { get, post } from "./request";
import { v4 as uuid } from "uuid";
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

export function generateUserId(): string {
  const userId = uuid();
  return userId;
}

export function createDevice(): types.Device {
  const device = new Device();

  return device;
}

export async function loadDevice(
  userId: string,
  device: types.Device
): Promise<void> {
  const routerRtpCapabilities = await get<types.RtpCapabilities>(
    "/router-capabilities"
  );

  await device.load({ routerRtpCapabilities });
}

export async function createTransport(
  userId: string,
  device: Device,
  type: "send" | "recv"
): Promise<types.Transport> {
  if (!device.loaded) {
    throw new Error("createTransport: Device must be loaded");
  }

  const request: InitConnectionParams = {
    userId,
    sctpCapabilities: device.sctpCapabilities,
  };

  const {
    transportId,
    iceParameters,
    iceCandidates,
    dtlsParameters,
    sctpParameters,
  } = await post<ConnectionInfo>("/connect/init", request);

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
      await post<void>(`/connect/create`, connectParams);
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
            userId,
            transportId,
            kind,
            rtpParameters,
          };

          const producerId = await post(`/send/create`, req);

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

  await get<void>(`/receive/${info.consumerId}/play`);
  consumer.resume();

  return consumer;
}

async function createRecvMediaStream(
  producerUserId: string,
  transport: types.Transport,
  infos: ConsumerInfo[]
): Promise<[string, MediaStream]> {
  const stream = consumerStreams.get(producerUserId) ?? new MediaStream();
  consumerStreams.set(producerUserId, stream);

  const consumers = await Promise.all(
    infos.map((info) => createConsumer(transport, info))
  );

  consumers.forEach(({ track }) => {
    if (!stream.getTrackById(track.id)) {
      stream.addTrack(track);
    }
  });

  return [producerUserId, stream];
}

export async function recvStreams(
  userId: string,
  device: types.Device,
  transport: types.Transport
): Promise<{ [userId: string]: MediaStream }> {
  const req: ReceiveParams = {
    userId,
    transportId: transport.id,
    rtpCapabilities: device.rtpCapabilities,
  };

  const info = await post<ReceiveInfo>("/receive/create", req);

  const tasks: Array<Promise<[string, MediaStream]>> = [];
  for (const [producerUserId, consumersInfos] of Object.entries(info)) {
    tasks.push(
      createRecvMediaStream(producerUserId, transport, consumersInfos)
    );
  }

  return Object.fromEntries(await Promise.all(tasks));
}

// export async function connectAsSpeaker(
//   context: SceneContext
// ): Promise<SceneContext> {
//   // TODO: if device already exists

//   const device = new Device();

//   const basePath = `/scene/${context.scene.id}/cohort`;

//   if (context.scene.cohorts.length === 0) {
//     throw new Error("connectAsSpeaker: scene doesn't have a valid cohort");
//   }
//   const routerRtpCapabilities = await get<types.RtpCapabilities>(
//     `${basePath}/${context.scene.cohorts[0].routerId}/capabilities`
//   );

//   await device.load({ routerRtpCapabilities });

//   const request: CohortConnectRequest = {
//     type: "speaker",
//     username: getUsername(context),
//     sctpCapabilities: device.sctpCapabilities,
//   };

//   const stream = await navigator.mediaDevices.getUserMedia({
//     video: {
//       width: { ideal: 1280 },
//       height: { ideal: 720 },
//     },
//   });
//   const track = stream.getVideoTracks()[0];

//   const connections = { ...context.connections };
//   const producers = { ...context.producers };

//   // TODO: use allSettled to handle errors
//   await Promise.all(
//     context.scene.cohorts.map(async (cohort) => {
//       if (connections[cohort.routerId]) {
//         // TODO: handle possible reconnections
//         throw new Error(
//           "connectAsSpeaker: connection already exists for cohort"
//         );
//       }
//       const {
//         transportId,
//         iceParameters,
//         iceCandidates,
//         dtlsParameters,
//         sctpParameters,
//       } = await post<CohortConnectResponse>(
//         `${basePath}/${cohort.routerId}/connect`,
//         request
//       );

//       const sendTransport = device.createSendTransport({
//         id: transportId,
//         iceParameters,
//         iceCandidates,
//         dtlsParameters,
//         sctpParameters,
//         iceServers: [],
//       });

//       sendTransport.on(
//         "connect",
//         async ({ dtlsParameters }, callback, errback) => {
//           try {
//             await post<CohortConnectResponse>(
//               `${basePath}/${cohort.routerId}/connect/${transportId}`,
//               dtlsParameters
//             );
//             callback();
//           } catch (e) {
//             errback(e);
//           }
//         }
//       );

//       sendTransport.on(
//         "produce",
//         async ({ kind, rtpParameters }, callback, errback) => {
//           try {
//             const name = context.me && context.me.name;
//             const producerId = await post(
//               `${basePath}/${cohort.routerId}/produce/${name}/create`,
//               { kind, rtpParameters }
//             );

//             callback({ id: producerId });
//           } catch (error) {
//             errback(error);
//           }
//         }
//       );

//       sendTransport.on("connectionstatechange", (e) => {
//         console.log("sendTransport connection changed", e);
//       });

//       // TODO: save producer in context for start/pause/stop
//       const producer = await sendTransport.produce({
//         track,
//         codecOptions: {
//           videoGoogleStartBitrate: 1000,
//           videoGoogleMaxBitrate: 2000000,
//         },
//         encodings: [
//           { scaleResolutionDownBy: 4, maxBitrate: 500000 },
//           { scaleResolutionDownBy: 2, maxBitrate: 1000000 },
//           { scaleResolutionDownBy: 1, maxBitrate: 2000000 },
//         ],
//       });

//       connections[cohort.routerId] = sendTransport;
//       producers[producer.id] = producer;
//     })
//   );

//   return {
//     ...context,
//     connections,
//     videoTrack: track,
//   };
// }

// export async function connectAsFollower(
//   context: SceneContext
// ): Promise<SceneContext> {
//   // TODO: if device already exists

//   const device = new Device();

//   if (context.scene.cohorts.length === 0) {
//     throw new Error("connectAsSpeaker: scene doesn't have a valid cohort");
//   }
//   const cohort = context.scene.cohorts[0];
//   const basePath = `/scene/${context.scene.id}/cohort/${cohort.routerId}`;
//   const routerRtpCapabilities = await get<types.RtpCapabilities>(
//     `${basePath}/capabilities`
//   );

//   await device.load({ routerRtpCapabilities });

//   const request: CohortConnectRequest = {
//     type: "follower",
//     sctpCapabilities: device.sctpCapabilities,
//   };

//   const connections = { ...context.connections };
//   const speakerId = Object.keys(cohort.speakers)[0];
//   if (!speakerId) {
//     throw new Error("connectAsFollower: no speaker");
//   }
//   const speaker: Speaker | undefined = cohort.speakers[speakerId];

//   const {
//     transportId,
//     iceParameters,
//     iceCandidates,
//     dtlsParameters,
//     sctpParameters,
//   } = await post<CohortConnectResponse>(`${basePath}/connect`, request);

//   const recvTransport = device.createRecvTransport({
//     id: transportId,
//     iceParameters,
//     iceCandidates,
//     dtlsParameters,
//     sctpParameters,
//     iceServers: [],
//   });

//   recvTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
//     try {
//       await post<CohortConnectResponse>(
//         `${basePath}/connect/${transportId}`,
//         dtlsParameters
//       );
//       callback();
//     } catch (e) {
//       errback(e);
//     }
//   });

//   recvTransport.on("connectionstatechange", (e) => {
//     console.log("sendTransport connection changed", e);
//   });

//   const { consumerId, kind, rtpParameters } = await post(
//     `/consume/${speaker.producerId}/${transportId}/create`,
//     {
//       rtpCapabilities: device.rtpCapabilities,
//     }
//   );

//   const consumer = await recvTransport.consume({
//     id: consumerId,
//     producerId: speaker.producerId,
//     kind,
//     rtpParameters,
//   });

//   return {
//     ...context,
//     connections,
//     videoTrack: consumer.track,
//   };
// }
