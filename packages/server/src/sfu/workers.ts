import { createWorker as createMediaSoupWorker, types } from "mediasoup";
import { WorkerUsage } from "./types";

type WorkerData = {};

const workers: Map<types.Worker, WorkerData> = new Map();

async function createWorker(data: WorkerData): Promise<types.Worker> {
  const worker = await createMediaSoupWorker({
    logLevel: "debug", // TODO: config via env-vars
    rtcMinPort: 10000, // TODO: config via env-vars
    rtcMaxPort: 59999, // TODO: config via env-vars
  });

  workers.set(worker, data);

  // TODO: control via env-vars
  const interval = setInterval(async () => {
    const usage = await worker.getResourceUsage();
    console.log(
      "mediasoup Worker resource usage [id:%d]: %o",
      worker.pid,
      usage
    );
  }, 120000);

  const onWorkerError = (error: Error): void => {
    clearInterval(interval);
    console.error("mediasoup worker died!: %o", error);
    // TODO: should never happen, but we need to handle the case (exit?)
  };

  worker.on("died", onWorkerError);

  worker.observer.on("close", (): void => {
    workers.delete(worker);
    worker.removeListener("died", onWorkerError);
  });

  return worker;
}

export function initWorkers(count: number): void {
  for (let i = 0; i < count; i++) {
    createWorker({ id: i });
  }
}

// TODO: This could be improve in the future to handle resource usage
export function pickAvailableWorker(usage: WorkerUsage): types.Worker {
  let bestWorker: types.Worker | null = null;
  let lowerRouterCount = Infinity;

  for (const [worker] of workers) {
    const routerCount = usage?.[worker.pid]?.routerCount ?? 0;

    if (routerCount === 0) {
      return worker;
    }
    if (routerCount < lowerRouterCount) {
      lowerRouterCount = routerCount;
      bestWorker = worker;
    }
  }

  if (bestWorker === null) {
    throw new Error("workers/pickAvailableWorker: no available workers");
  }

  return bestWorker;
}
