import { Scene, Host, Speaker } from "../../server/src/scene/model";
import {
  CohortConnectRequest,
  CohortConnectResponse,
} from "../../server/src/api/queries";
import { get, post } from "./request";
import { Device, types } from "mediasoup-client";
import { SceneContext, initSceneContext, getUsername } from "./SceneContext";

export async function createScene(name: string): Promise<SceneContext> {
  const scene = await get<Scene>(`/scene/${name}`);
  return initSceneContext(scene);
}

export async function createHost(
  context: SceneContext,
  name: string
): Promise<SceneContext> {
  const host: Host = {
    hosting: true,
    name,
  };

  const { me, scene } = await post<{ me: Host; scene: Scene }>(
    `/scene/${context.scene.id}/create-host`,
    host
  );

  return {
    ...context,
    me,
    scene,
  };
}

export async function connectAsSpeaker(
  context: SceneContext
): Promise<SceneContext> {
  // TODO: if device already exists

  const device = new Device();

  const basePath = `/scene/${context.scene.id}/cohort`;

  if (context.scene.cohorts.length === 0) {
    throw new Error("connectAsSpeaker: scene doesn't have a valid cohort");
  }
  const routerRtpCapabilities = await get<types.RtpCapabilities>(
    `${basePath}/${context.scene.cohorts[0].routerId}/capabilities`
  );

  await device.load({ routerRtpCapabilities });

  const request: CohortConnectRequest = {
    type: "speaker",
    username: getUsername(context),
    sctpCapabilities: device.sctpCapabilities,
  };

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
  });
  const track = stream.getVideoTracks()[0];

  const connections = { ...context.connections };
  const producers = { ...context.producers };

  // TODO: use allSettled to handle errors
  await Promise.all(
    context.scene.cohorts.map(async (cohort) => {
      if (connections[cohort.routerId]) {
        // TODO: handle possible reconnections
        throw new Error(
          "connectAsSpeaker: connection already exists for cohort"
        );
      }
      const {
        transportId,
        iceParameters,
        iceCandidates,
        dtlsParameters,
        sctpParameters,
      } = await post<CohortConnectResponse>(
        `${basePath}/${cohort.routerId}/connect`,
        request
      );

      const sendTransport = device.createSendTransport({
        id: transportId,
        iceParameters,
        iceCandidates,
        dtlsParameters,
        sctpParameters,
        iceServers: [],
      });

      sendTransport.on(
        "connect",
        async ({ dtlsParameters }, callback, errback) => {
          try {
            await post<CohortConnectResponse>(
              `${basePath}/${cohort.routerId}/connect/${transportId}`,
              dtlsParameters
            );
            callback();
          } catch (e) {
            errback(e);
          }
        }
      );

      sendTransport.on(
        "produce",
        async ({ kind, rtpParameters }, callback, errback) => {
          try {
            const name = context.me && context.me.name;
            const producerId = await post(
              `${basePath}/${cohort.routerId}/produce/${name}/create`,
              { kind, rtpParameters }
            );

            callback({ id: producerId });
          } catch (error) {
            errback(error);
          }
        }
      );

      sendTransport.on("connectionstatechange", (e) => {
        console.log("sendTransport connection changed", e);
      });

      // TODO: save producer in context for start/pause/stop
      const producer = await sendTransport.produce({
        track,
        codecOptions: {
          videoGoogleStartBitrate: 1000,
          videoGoogleMaxBitrate: 2000000,
        },
        encodings: [
          { scaleResolutionDownBy: 4, maxBitrate: 500000 },
          { scaleResolutionDownBy: 2, maxBitrate: 1000000 },
          { scaleResolutionDownBy: 1, maxBitrate: 2000000 },
        ],
      });

      connections[cohort.routerId] = sendTransport;
      producers[producer.id] = producer;
    })
  );

  return {
    ...context,
    connections,
    videoTrack: track,
  };
}

export async function connectAsFollower(
  context: SceneContext
): Promise<SceneContext> {
  // TODO: if device already exists

  const device = new Device();

  if (context.scene.cohorts.length === 0) {
    throw new Error("connectAsSpeaker: scene doesn't have a valid cohort");
  }
  const cohort = context.scene.cohorts[0];
  const basePath = `/scene/${context.scene.id}/cohort/${cohort.routerId}`;
  const routerRtpCapabilities = await get<types.RtpCapabilities>(
    `${basePath}/capabilities`
  );

  await device.load({ routerRtpCapabilities });

  const request: CohortConnectRequest = {
    type: "follower",
    sctpCapabilities: device.sctpCapabilities,
  };

  const connections = { ...context.connections };
  const speakerId = Object.keys(cohort.speakers)[0];
  if (!speakerId) {
    throw new Error("connectAsFollower: no speaker");
  }
  const speaker: Speaker | undefined = cohort.speakers[speakerId];

  const {
    transportId,
    iceParameters,
    iceCandidates,
    dtlsParameters,
    sctpParameters,
  } = await post<CohortConnectResponse>(`${basePath}/connect`, request);

  const recvTransport = device.createRecvTransport({
    id: transportId,
    iceParameters,
    iceCandidates,
    dtlsParameters,
    sctpParameters,
    iceServers: [],
  });

  recvTransport.on("connect", async ({ dtlsParameters }, callback, errback) => {
    try {
      await post<CohortConnectResponse>(
        `${basePath}/connect/${transportId}`,
        dtlsParameters
      );
      callback();
    } catch (e) {
      errback(e);
    }
  });

  recvTransport.on("connectionstatechange", (e) => {
    console.log("sendTransport connection changed", e);
  });

  const { consumerId, kind, rtpParameters } = await post(
    `/consume/${speaker.producerId}/${transportId}/create`,
    {
      rtpCapabilities: device.rtpCapabilities,
    }
  );

  const consumer = await recvTransport.consume({
    id: consumerId,
    producerId: speaker.producerId,
    kind,
    rtpParameters,
  });

  return {
    ...context,
    connections,
    videoTrack: consumer.track,
  };
}
