import os from "os";
import { createWorker } from "./resources/workers";
import { createRouter, getRouter, getRouters } from "./resources/routers";
import { types } from "mediasoup";
import {
  createTransport,
  connectTransport,
  destroyTransport,
  getTransportMeta,
  getTransport,
  getTransportUsage,
} from "./resources/transport";
import { createProducer, getProducer } from "./resources/producers";
import {
  createConsumer,
  getConsumer,
  getProducerConsumer,
} from "./resources/consumers";
import {
  InitConnectionParams,
  ConnectionInfo,
  ConnectParams,
  SendParams,
  ReceiveParams,
  ConsumerInfo,
  SendDestroyParams,
} from "../../../types";

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

export function getLessUsedRouterId(): string {
  const best: { id: string | null; load: number } = { id: null, load: 0 };

  const transportUsage = getTransportUsage();
  const routers = getRouters();

  for (let i = 0; i < routers.length; i += 1) {
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
  request: InitConnectionParams
): Promise<ConnectionInfo> {
  const routerId = getLessUsedRouterId();
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

export function disconnect(transportId: string): void {
  destroyTransport(transportId);
}

export async function send(params: SendParams): Promise<string> {
  const { transportId, kind, rtpParameters } = params;
  const transport = getTransport(transportId);
  const { routerId } = getTransportMeta(transportId);

  const producer = await createProducer(transport, kind, rtpParameters);

  const sourceRouter = getRouter(routerId);
  const routers = getRouters();
  for (const router of routers) {
    if (router.id !== sourceRouter.id) {
      sourceRouter.pipeToRouter({
        producerId: producer.id,
        router,
      });
    }
  }

  return producer.id;
}

export async function destroySend(params: SendDestroyParams): Promise<null> {
  const producer = getProducer(params.producerId);
  producer.close();
  return null;
}

export async function receive(params: ReceiveParams): Promise<ConsumerInfo> {
  const { transportId, producerId, rtpCapabilities } = params;
  // TODO: check sourceTransportId match
  const producer = getProducer(producerId);
  const selfTransport = getTransport(transportId);
  const existingConsumer = getProducerConsumer(producer, selfTransport);

  if (existingConsumer !== null) {
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
    rtpCapabilities
  );

  return {
    consumerId: consumer.id,
    producerId: producer.id,
    kind: producer.kind,
    rtpParameters: consumer.rtpParameters,
  };
}

export async function play(consumerId: string): Promise<void> {
  const consumer = getConsumer(consumerId);
  await consumer.resume();
}
