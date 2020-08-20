import type { types } from "mediasoup";

export type ConsumerTopology = {
  id: string;
  kind: types.MediaKind;
  producerId: string;
  state: {
    paused: boolean;
    closed: boolean;
    type: types.ConsumerType;
    producerPaused: boolean;
    currentLayers: types.ConsumerLayers | void;
  };
};

export type ProducerTopology = {
  id: string;
  kind: types.MediaKind;
  consumers: ConsumerTopology[];
  state: {
    paused: boolean;
    closed: boolean;
  };
  stats: types.ProducerStat[];
};

export type TransportTopology = {
  id: string;
  producers: ProducerTopology[];
  consumers: ConsumerTopology[];
};

export type RouterTopology = {
  id: string;
  transports: TransportTopology[];
};

export type WorkerTopology = {
  pid: number;
  router: RouterTopology;
};

export type ServerTopology = {
  workers: WorkerTopology[];
};
