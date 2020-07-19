import { types } from "mediasoup";
import { getWorkerRouter } from "./resources/routers";
import {
  getRouterTransports,
  getTransportMeta,
  getTransport,
  getTransports,
} from "./resources/transport";
import { getWorkers } from "./resources/workers";
import {
  getProducer,
  getProducerMeta,
  getTransportProducers,
} from "./resources/producers";
import {
  getTransportConsumers,
  getProducerConsumers,
} from "./resources/consumers";

type ConsumerTopology = {
  id: string;
  kind: types.MediaKind;
  producerUserId: string;
  producerId: string;
  state: {
    paused: boolean;
    closed: boolean;
    type: types.ConsumerType;
    producerPaused: boolean;
    currentLayers: types.ConsumerLayers | void;
  };
};

type ProducerTopology = {
  id: string;
  userId: string;
  kind: types.MediaKind;
  consumers: ConsumerTopology[];
  state: {
    paused: boolean;
    closed: boolean;
  };
  stats: types.ProducerStat[];
};

type TransportTopology = {
  id: string;
  userId: string;
  producers: ProducerTopology[];
  consumers: ConsumerTopology[];
};

type RouterTopology = {
  id: string;
  transports: TransportTopology[];
};

type WorkerTopology = {
  pid: number;
  router: RouterTopology;
};

type ServerTopology = {
  workers: WorkerTopology[];
};

function getConsumerTopology(consumer: types.Consumer): ConsumerTopology {
  return {
    id: consumer.id,
    kind: consumer.kind,
    producerId: consumer.producerId,
    producerUserId: getProducerMeta(getProducer(consumer.producerId)).userId,
    state: {
      paused: consumer.paused,
      closed: consumer.closed,
      type: consumer.type,
      producerPaused: consumer.producerPaused,
      currentLayers: consumer.currentLayers,
    },
  };
}

async function getProducerTopology(
  producer: types.Producer
): Promise<ProducerTopology> {
  return {
    id: producer.id,
    kind: producer.kind,
    userId: getProducerMeta(producer).userId,
    consumers: getProducerConsumers(producer).map(getConsumerTopology),
    state: {
      paused: producer.paused,
      closed: producer.closed,
    },
    stats: await producer.getStats(),
  };
}

async function getTransportTopology(
  transport: types.Transport
): Promise<TransportTopology> {
  return {
    id: transport.id,
    userId: getTransportMeta(transport.id).userId,
    consumers: getTransportConsumers(transport.id).map(getConsumerTopology),
    producers: await Promise.all(
      getTransportProducers(transport).map(getProducerTopology)
    ),
  };
}

async function getRouterTopology(
  router: types.Router
): Promise<RouterTopology> {
  return {
    id: router.id,
    transports: await Promise.all(
      getRouterTransports(router).map(getTransportTopology)
    ),
  };
}

async function getWorkerTopology(
  worker: types.Worker
): Promise<WorkerTopology> {
  return {
    pid: worker.pid,
    router: await getRouterTopology(getWorkerRouter(worker)),
  };
}

export async function getServerTopology(): Promise<ServerTopology> {
  const workers = getWorkers();

  return {
    workers: await Promise.all(workers.map(getWorkerTopology)),
  };
}

export function cleanup(): void {
  getTransports().forEach((t) => t.close());
}
