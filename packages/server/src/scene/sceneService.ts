// TODO: Scenes should be managed through database

import { Scene, Host, Cohort } from "./model";
import { createRouter, getRouter } from "../sfu/routers";
import { types } from "mediasoup";
import { CohortConnectRequest, CohortConnectResponse } from "../api/queries";
import { createTransport, connectTransport } from "../sfu/transport";
import { MediaKind } from "mediasoup/lib/types";
import { createProducer } from "../sfu/producers";
import { createConsumer } from "../sfu/consumers";

const scenes: Map<string, Scene> = new Map();

async function createCohort(): Promise<Cohort> {
  const router = await createRouter();

  // TODO: Handle
  // router.on("close", () => {});

  return {
    followers: [],
    speakers: {},
    routerId: router.id,
  };
}

async function createScene(id: string): Promise<Scene> {
  if (scenes.has(id)) {
    throw new Error("sceneService/createScene: scene already exists");
  }

  const scene: Scene = {
    id,
    hosts: {},
    guests: {},
    onStage: [],
    cohorts: [await createCohort()],
  };

  scenes.set(id, scene);

  console.log("creating scene %s", id);

  return scene;
}

export function getOrCreateScene(id: string): Scene | Promise<Scene> {
  return scenes.get(id) ?? createScene(id);
}

export function getScene(id: string): Scene {
  const scene = scenes.get(id);
  if (scene == null) {
    throw new Error("scene not found");
  }

  return scene;
}

export async function addHost(sceneId: string, host: Host): Promise<Scene> {
  const scene = await getOrCreateScene(sceneId);

  if (scene.hosts[host.name]) {
    // TODO: handle
    // throw new Error("Host already exists");
  }

  scene.hosts[host.name] = host;

  return scene;
}

export function getCohort(sceneId: string, routerId: string): Cohort {
  const scene = getScene(sceneId);
  for (const cohort of scene.cohorts) {
    if (cohort.routerId === routerId) {
      return cohort;
    }
  }

  throw new Error("cohort not found");
}

export async function getCohortCapabilities(
  sceneId: string,
  routerId: string
): Promise<types.RtpCapabilities> {
  const cohort = getCohort(sceneId, routerId);

  const router = await getRouter(cohort.routerId);

  return router.rtpCapabilities;
}

export function getHost(sceneId: string, username: string): Host {
  const scene = getScene(sceneId);
  const host = scene.hosts[username];

  if (host == null) {
    throw new Error("Host not found " + username);
  }

  return host;
}

export async function connectToCohort(
  sceneId: string,
  routerId: string,
  request: CohortConnectRequest
): Promise<CohortConnectResponse> {
  const cohort = getCohort(sceneId, routerId);
  const transport = await createTransport(routerId, request.sctpCapabilities);

  if (request.type === "speaker") {
    const { username } = request;
    cohort.speakers[username] = {
      username,
      status: "connecting",
      transportId: transport.id,
      producerId: null,
    };
  }

  return {
    transportId: transport.id,
    iceParameters: transport.iceParameters,
    iceCandidates: transport.iceCandidates,
    dtlsParameters: transport.dtlsParameters,
    sctpParameters: transport.sctpParameters,
  };
}

export async function onConnected(
  transportId: string,
  dtlsParameters: types.DtlsParameters
): Promise<void> {
  await connectTransport(transportId, dtlsParameters);
}

export async function produce(
  sceneId: string,
  routerId: string,
  username: string,
  kind: types.MediaKind,
  rtpParameters: types.RtpParameters
): Promise<types.Producer> {
  const cohort = getCohort(sceneId, routerId);
  const producer = await createProducer(
    cohort.speakers[username].transportId,
    kind,
    rtpParameters
  );
  cohort.speakers[username].status = "active";
  cohort.speakers[username].producerId = producer.id;

  return producer;
}

export async function consume(
  transportId: string,
  producerId: string,
  rtpCapabilities: types.RtpCapabilities
): Promise<types.Consumer> {
  return createConsumer(transportId, producerId, rtpCapabilities);
}
