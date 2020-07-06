// TODO: Scenes should be managed through database

import { Scene, Host, Cohort } from "./model";
import { createRouter, getRouter } from "../sfu/routers";
import { types } from "mediasoup";
import { CohortConnectRequest, CohortConnectResponse } from "../api/queries";
import { createTransport } from "../sfu/transport";

const scenes: Map<string, Scene> = new Map();

async function createCohort(): Promise<Cohort> {
  const router = await createRouter();

  // TODO: Handle
  // router.on("close", () => {});

  return {
    followers: [],
    speakers: [],
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
    throw new Error("Host already exists");
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
    throw new Error("Host not found");
  }

  return host;
}

export async function connectToCohort(
  sceneId: string,
  routerId: string,
  request: CohortConnectRequest
): Promise<CohortConnectResponse> {
  const { type, sctpCapabilities, username } = request;
  const cohort = getCohort(sceneId, routerId);

  if (type === "speaker") {
    // Ensure host exists
    const host = getHost(sceneId, username);
    const transport = await createTransport(routerId, sctpCapabilities);

    cohort.speakers.push({
      who: host,
      status: "connecting",
      transport,
    });

    return {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
      sctpParameters: transport.sctpParameters,
    };
  }

  throw new Error("connectToCohort: type follower not implemented");
}
