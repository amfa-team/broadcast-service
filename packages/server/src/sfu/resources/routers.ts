import type { types } from "mediasoup";

// https://mediasoup.org/documentation/v3/mediasoup/api/#RouterOptions
const MEDIA_CODECS: types.RtpCodecCapability[] = [
  {
    kind: "audio",
    mimeType: "audio/opus",
    clockRate: 48000,
    channels: 2,
  },
  {
    kind: "video",
    mimeType: "video/VP8",
    clockRate: 90000,
    parameters: {
      "x-google-start-bitrate": 1000,
    },
  },
  {
    kind: "video",
    mimeType: "video/VP9",
    clockRate: 90000,
    parameters: {
      "profile-id": 2,
      "x-google-start-bitrate": 1000,
    },
  },
  {
    kind: "video",
    mimeType: "video/h264",
    clockRate: 90000,
    parameters: {
      "packetization-mode": 1,
      "profile-level-id": "4d0032",
      "level-asymmetry-allowed": 1,
      "x-google-start-bitrate": 1000,
    },
  },
  {
    kind: "video",
    mimeType: "video/h264",
    clockRate: 90000,
    parameters: {
      "packetization-mode": 1,
      "profile-level-id": "42e01f",
      "level-asymmetry-allowed": 1,
      "x-google-start-bitrate": 1000,
    },
  },
];

type RouterMeta = {
  workerPid: number;
};

const routers: Map<string, types.Router> = new Map();
const routersMeta: WeakMap<types.Router, RouterMeta> = new WeakMap();

export async function createRouter(
  worker: types.Worker,
): Promise<types.Router> {
  const router = await worker.createRouter({
    mediaCodecs: MEDIA_CODECS,
  });

  router.on("workerclose", () => {
    // Router is closed automatically
    routers.delete(router.id);
    // TODO: remove from topology but should never happen
  });

  routers.set(router.id, router);
  routersMeta.set(router, { workerPid: worker.pid });

  return router;
}

export function getRouter(routerId: string): types.Router {
  const router = routers.get(routerId);

  if (!router) {
    throw new Error("router not found or deleted");
  }

  return router;
}

export function getRouters(): types.Router[] {
  return [...routers.values()];
}

export function getRouterMeta(router: types.Router): RouterMeta {
  const meta = routersMeta.get(router);

  if (!meta) {
    throw new Error("meta not found or deleted");
  }

  return meta;
}

export function getWorkerRouter(worker: types.Worker): types.Router {
  const allRouters = getRouters();
  for (const router of allRouters) {
    if (getRouterMeta(router).workerPid === worker.pid) {
      return router;
    }
  }

  throw new Error("worker does not have associated router");
}
