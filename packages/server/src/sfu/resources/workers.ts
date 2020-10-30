import type { types } from "mediasoup";
import { createWorker as createMediaSoupWorker } from "mediasoup";

const workers: Map<number, types.Worker> = new Map();

export async function createWorker(): Promise<types.Worker> {
  const worker = await createMediaSoupWorker({
    logLevel: "warn",
    rtcMinPort: 10000, // TODO: config via env-vars
    rtcMaxPort: 59999, // TODO: config via env-vars
  });

  workers.set(worker.pid, worker);

  // TODO: control via env-vars
  // const interval = setInterval(async () => {
  //   const usage = await worker.getResourceUsage();
  //   console.log(
  //     "mediasoup Worker resource usage [id:%d]: %o",
  //     worker.pid,
  //     usage
  //   );
  // }, 120000);

  const onWorkerError = (error: Error): void => {
    // clearInterval(interval);
    console.error("mediasoup worker died!: %o", error);
    // TODO: should never happen, but we need to handle the case (exit?)
  };

  worker.on("died", onWorkerError);

  return worker;
}

export function getWorker(pid: number): types.Worker {
  const worker = workers.get(pid);

  if (!worker) {
    throw new Error("worker not found or deleted");
  }

  return worker;
}

export function getWorkers(): types.Worker[] {
  return [...workers.values()];
}
