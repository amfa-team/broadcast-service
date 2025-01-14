import type { ProducerState } from "@amfa-team/broadcast-service-types";
import debounce from "lodash.debounce";
import type { types } from "mediasoup";
import { requestApi } from "../../io/api";

type ProducerMeta = {
  transportId: string;
};

const producers: Map<string, types.Producer> = new Map();
const producersMeta: WeakMap<types.Producer, ProducerMeta> = new WeakMap();

const DEBOUNCE_WAIT = process.env.NODE_ENV === "production" ? 4000 : 20000;

export function getProducerScore(producer: types.Producer): number {
  const { score } = producer;

  return score.length === 0
    ? 0
    : score.reduce((acc: number, s) => acc + s.score, 0) / score.length;
}

export function getProducerState(producer: types.Producer): ProducerState {
  return {
    paused: producer.paused,
    score: getProducerScore(producer),
  };
}

export async function createProducer(
  transport: types.Transport,
  kind: types.MediaKind,
  rtpParameters: types.RtpParameters,
): Promise<types.Producer> {
  const producer = await transport.produce({
    kind,
    rtpParameters,
    // Bad connections should not break producer
    keyFrameRequestDelay: 4_000,
  });

  const onStateChange = () => {
    requestApi("/event/producer/state/change", {
      transportId: transport.id,
      producerId: producer.id,
      state: getProducerState(producer),
    }).catch((e) => {
      console.error("Producer.onStateChange: fail", e);
    });
  };
  const onScoreChange = debounce(onStateChange, DEBOUNCE_WAIT, {
    maxWait: DEBOUNCE_WAIT * 5,
  });

  // Set Producer events.
  producer.on("score", onScoreChange);
  producer.observer.on("resume", onStateChange);
  producer.observer.on("pause", onStateChange);

  producer.on("transportclose", () => {
    producer.close();
  });

  producer.observer.on("close", () => {
    producers.delete(producer.id);
  });

  producers.set(producer.id, producer);
  producersMeta.set(producer, { transportId: transport.id });

  return producer;
}

export function getProducers(): types.Producer[] {
  return [...producers.values()];
}

export function getOptionalProducer(producerId: string): null | types.Producer {
  const producer = producers.get(producerId);
  return producer ?? null;
}

export function getProducer(producerId: string): types.Producer {
  const producer = getOptionalProducer(producerId);

  if (!producer) {
    throw new Error("producer not found or deleted");
  }

  return producer;
}

export function getProducerMeta(producer: types.Producer): ProducerMeta {
  const meta = producersMeta.get(producer);

  if (!meta) {
    throw new Error("meta not found or deleted");
  }

  return meta;
}

export function getTransportProducers(
  transport: types.Transport,
): types.Producer[] {
  return [...producers.values()].filter(
    (producer) => getProducerMeta(producer).transportId === transport.id,
  );
}
