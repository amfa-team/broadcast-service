import os from "os";
import type {
  ConnectParams,
  ConnectionInfo,
  ConsumerInfo,
  DestroyConnectionParams,
  InitConnectionParams,
  ReceiveParams,
  Routes,
  SendDestroyParams,
  SendParams,
} from "@amfa-team/types";
import type { types } from "mediasoup";
import {
  createConsumer,
  getConsumer,
  getConsumerState,
  getOptionalConsumer,
  getProducerConsumer,
} from "./resources/consumers";
import {
  createProducer,
  getOptionalProducer,
  getProducer,
  getProducerState,
} from "./resources/producers";
import { createRouter, getRouter, getRouters } from "./resources/routers";
import {
  connectTransport,
  createTransport,
  destroyTransport,
  getTransport,
  getTransportMeta,
  getTransportUsage,
} from "./resources/transport";
import { createWorker } from "./resources/workers";

async function initWorker(): Promise<void> {
  const worker = await createWorker();
  await createRouter(worker);
}

export async function startup(): Promise<void> {
  const workerCount = Number(process.env.WORKER_COUNT ?? os.cpus().length);

  const tasks = [];

  for (let i = 0; i < workerCount; i += 1) {
    tasks.push(initWorker());
  }

  await Promise.all(tasks);
}

export function getLessUsedRouterId(type: "send" | "recv" = "recv"): string {
  const best: { id: string | null; load: number } = { id: null, load: 0 };

  const transportUsage = getTransportUsage();
  const routers = getRouters();

  if (type === "send" || routers.length === 1) {
    return routers[0].id;
  }

  // Ignore first router, which is reserved for producers only
  for (let i = 1; i < routers.length; i += 1) {
    const routerId = routers[i].id;
    const load = transportUsage[routerId] ?? 0;
    if (best.id === null || best.load > load) {
      best.id = routers[i].id;
      best.load = load;
    }
  }

  if (best.id === null) {
    throw new Error("topologyService/getLessUsedRouterId: no available router");
  }

  return best.id;
}

export function getRouterCapabilities(): types.RtpCapabilities {
  const routerId = getLessUsedRouterId();
  const router = getRouter(routerId);

  // All routers will have same capabilities
  return router.rtpCapabilities;
}

export async function initConnection(
  request: InitConnectionParams,
): Promise<ConnectionInfo> {
  const routerId = getLessUsedRouterId(request.type);
  const router = getRouter(routerId);

  const transport = await createTransport(router, request.sctpCapabilities);

  return {
    transportId: transport.id,
    iceParameters: transport.iceParameters,
    iceCandidates: transport.iceCandidates,
    dtlsParameters: transport.dtlsParameters,
    sctpParameters: transport.sctpParameters,
  };
}

export async function connect(params: ConnectParams): Promise<void> {
  await connectTransport(params.transportId, params.dtlsParameters);
}

export function disconnect(params: DestroyConnectionParams): void {
  setTimeout(() => destroyTransport(params.transportId), params.delay);
}

export async function send(params: SendParams): Promise<string> {
  const { transportId, kind, rtpParameters } = params;
  const transport = getTransport(transportId);
  const { routerId } = getTransportMeta(transportId);

  const producer = await createProducer(transport, kind, rtpParameters);

  const sourceRouter = getRouter(routerId);
  const routers = getRouters();
  const tasks = [];
  for (const router of routers) {
    if (router.id !== sourceRouter.id) {
      tasks.push(
        sourceRouter.pipeToRouter({
          producerId: producer.id,
          router,
        }),
      );
    }
  }

  await Promise.all(tasks);

  return producer.id;
}

export async function sendState(
  params: Routes["/send/state"]["in"],
): Promise<Routes["/send/state"]["out"]> {
  const { producerId } = params;
  const producer = getProducer(producerId);
  return getProducerState(producer);
}

export async function destroySend(params: SendDestroyParams): Promise<null> {
  const { producerId, delay } = params;
  setTimeout(() => {
    const producer = getOptionalProducer(producerId);
    producer?.close();
  }, delay);
  return null;
}

export async function sendPlay(producerId: string): Promise<void> {
  const producer = getProducer(producerId);
  await producer.resume();
}

export async function sendPause(producerId: string): Promise<void> {
  // Use optional producer because on close we might request pause on already closed producer
  const producer = getOptionalProducer(producerId);
  await producer?.pause();
}

export async function receive(params: ReceiveParams): Promise<ConsumerInfo> {
  const { transportId, producerId, rtpCapabilities } = params;
  // TODO: check sourceTransportId match
  const producer = getProducer(producerId);
  const selfTransport = getTransport(transportId);
  const existingConsumer = getProducerConsumer(producer, selfTransport);

  if (existingConsumer !== null) {
    if (producer.kind === "audio") {
      await existingConsumer.setPriority(10);
    }

    return {
      consumerId: existingConsumer.id,
      producerId: producer.id,
      kind: producer.kind,
      rtpParameters: existingConsumer.rtpParameters,
    };
  }

  const consumer = await createConsumer(
    selfTransport,
    producer.id,
    rtpCapabilities,
  );

  if (producer.kind === "audio") {
    await consumer.setPriority(10);
  }

  return {
    consumerId: consumer.id,
    producerId: producer.id,
    kind: producer.kind,
    rtpParameters: consumer.rtpParameters,
  };
}

export async function receiveState(
  params: Routes["/receive/state"]["in"],
): Promise<Routes["/receive/state"]["out"]> {
  const { consumerId } = params;
  const consumer = getConsumer(consumerId);
  return getConsumerState(consumer);
}

export async function play(consumerId: string): Promise<void> {
  const consumer = getConsumer(consumerId);
  await consumer.resume();
}

export async function pause(consumerId: string): Promise<void> {
  // Use optional consumer because on close we might request pause on already closed consumer
  const consumer = getOptionalConsumer(consumerId);
  await consumer?.pause();
}
