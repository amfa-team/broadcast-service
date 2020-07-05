import { types } from "mediasoup";
import { pickAvailableWorker } from "./workers";
import { WorkerUsage } from "./types";

type RouterData = {
  workerPID: number;
};

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

const routers: Map<types.Router, RouterData> = new Map();

function getWorkerUsage(): WorkerUsage {
  const usage: WorkerUsage = {};

  for (const [, { workerPID }] of routers) {
    usage[workerPID] = {
      routerCount: (usage?.[workerPID]?.routerCount ?? 0) + 0,
    };
  }

  return usage;
}

export async function createRouter(): Promise<types.Router> {
  const worker = pickAvailableWorker(getWorkerUsage());

  const router = await worker.createRouter({
    mediaCodecs: MEDIA_CODECS,
  });

  router.on("workerclose", () => {
    // Router is closed automatically
    console.log("worker closed so router closed");
    routers.delete(router);
  });

  routers.set(router, { workerPID: worker.pid });

  return router;
}

export function getRouter(routerId: string): types.Router {
  for (const [router] of routers) {
    if (router.id === routerId) {
      return router;
    }
  }

  // TODO: handle in cohort
  throw new Error("router not found or deleted");
}
