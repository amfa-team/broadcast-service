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
import {
  createProducer,
  getProducers,
  getProducerMeta,
} from "./resources/producers";
import {
  createConsumer,
  getConsumer,
  getTransportConsumers,
} from "./resources/consumers";
import {
  InitConnectionParams,
  ConnectionInfo,
  ConnectParams,
  SendParams,
  ReceiveParams,
  ReceiveInfo,
} from "../../../types";

async function initWorker(): Promise<void> {
  const worker = await createWorker();
  await createRouter(worker);
}

export async function startup(): Promise<void> {
  const workerCount = Number(process.env.WORKER_COUNT ?? 1);

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

export async function receive(params: ReceiveParams): Promise<ReceiveInfo> {
  const { transportId, rtpCapabilities } = params;
  const producers = getProducers();
  const selfTransport = getTransport(transportId);

  const existingConsumers = getTransportConsumers(transportId);
  const consumerByProducerId = existingConsumers.reduce((acc, c) => {
    acc[c.producerId] = c;
    return acc;
  }, {} as { [producerId: string]: types.Consumer });

  const tasks: Array<Promise<[types.Consumer, string]>> = [];

  for (const producer of producers) {
    const { transportId: producerTransportId } = getProducerMeta(producer);

    if (transportId === producerTransportId) {
      // Do not receive self stream
      continue;
    }

    if (!consumerByProducerId[producer.id]) {
      tasks.push(
        createConsumer(
          selfTransport,
          producer.id,
          rtpCapabilities
        ).then((consumer) => [consumer, producer.id])
      );
    } else {
      tasks.push(
        Promise.resolve([consumerByProducerId[producer.id], producer.id])
      );
    }
  }

  const consumers = await Promise.all(tasks);

  return consumers.reduce((acc, [consumer, producerUserId]) => {
    const list = acc[producerUserId] ?? [];
    list.push({
      consumerId: consumer.id,
      producerId: consumer.producerId,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
    });
    acc[producerUserId] = list;
    return acc;
  }, {} as ReceiveInfo);
}

export async function play(consumerId: string): Promise<void> {
  const consumer = getConsumer(consumerId);
  await consumer.resume();
}
