import type {
  ConsumerTopology,
  ProducerTopology,
  RouterTopology,
  ServerTopology,
  TransportTopology,
  WorkerTopology,
} from "@amfa-team/types";
import type { types } from "mediasoup";
import {
  getProducerConsumers,
  getTransportConsumers,
} from "./resources/consumers";
import { getTransportProducers } from "./resources/producers";
import { getWorkerRouter } from "./resources/routers";
import { getRouterTransports, getTransports } from "./resources/transport";
import { getWorkers } from "./resources/workers";

function getConsumerTopology(consumer: types.Consumer): ConsumerTopology {
  return {
    id: consumer.id,
    kind: consumer.kind,
    producerId: consumer.producerId,
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
  producer: types.Producer,
): Promise<ProducerTopology> {
  return {
    id: producer.id,
    kind: producer.kind,
    consumers: getProducerConsumers(producer).map(getConsumerTopology),
    state: {
      paused: producer.paused,
      closed: producer.closed,
    },
    stats: await producer.getStats(),
  };
}

async function getTransportTopology(
  transport: types.Transport,
): Promise<TransportTopology> {
  return {
    id: transport.id,
    consumers: getTransportConsumers(transport.id).map(getConsumerTopology),
    producers: await Promise.all(
      getTransportProducers(transport).map(getProducerTopology),
    ),
  };
}

async function getRouterTopology(
  router: types.Router,
): Promise<RouterTopology> {
  return {
    id: router.id,
    transports: await Promise.all(
      getRouterTransports(router).map(getTransportTopology),
    ),
  };
}

async function getWorkerTopology(
  worker: types.Worker,
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
