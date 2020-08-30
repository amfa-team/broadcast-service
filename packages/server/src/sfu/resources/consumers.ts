import { types } from "mediasoup";
import { requestApi } from "../../io/api";
import { ConsumerState } from "../../../../types";

type ConsumerMeta = {
  transportId: string;
};

const consumers: Map<string, types.Consumer> = new Map();
const consumersMeta: WeakMap<types.Consumer, ConsumerMeta> = new Map();

export async function createConsumer(
  transport: types.Transport,
  producerId: string,
  rtpCapabilities: types.RtpCapabilities
): Promise<types.Consumer> {
  const consumer = await transport.consume({
    producerId,
    rtpCapabilities,
    paused: true,
  });

  consumer.on("transportclose", () => {
    consumer.close();
  });

  consumer.on("producerclose", () => {
    consumer.close();
  });

  consumer.observer.on("close", () => {
    consumers.delete(consumer.id);
  });

  const onStateChange = () => {
    requestApi("/event/consumer/state/change", {
      transportId: transport.id,
      consumerId: consumer.id,
      state: getConsumerState(consumer),
    }).catch((e) => {
      console.error("Consumer.onStateChange: fail", e);
    });
  };

  consumer.on("score", onStateChange);
  consumer.on("producerpause", onStateChange);
  consumer.on("producerresume", onStateChange);
  consumer.observer.on("resume", onStateChange);
  consumer.observer.on("pause", onStateChange);

  consumers.set(consumer.id, consumer);
  consumersMeta.set(consumer, { transportId: transport.id });

  return consumer;
}

export function getConsumerState(consumer: types.Consumer): ConsumerState {
  return {
    score: consumer.score.score,
    producerScore: consumer.score.producerScore,
    paused: consumer.paused,
    producerPaused: consumer.producerPaused,
  };
}

export function getOptionalConsumer(consumerId: string): types.Consumer | null {
  const consumer = consumers.get(consumerId);
  return consumer ?? null;
}

export function getConsumer(consumerId: string): types.Consumer {
  const consumer = getOptionalConsumer(consumerId);

  if (!consumer) {
    throw new Error("consumer not found or deleted");
  }

  return consumer;
}

export function getConsumerMeta(consumer: types.Consumer): ConsumerMeta {
  const meta = consumersMeta.get(consumer);

  if (!meta) {
    throw new Error("meta not found or deleted");
  }

  return meta;
}

export function getTransportConsumers(transportId: string): types.Consumer[] {
  return [...consumers.values()].filter(
    (consumer) => getConsumerMeta(consumer).transportId === transportId
  );
}

export function getProducerConsumers(
  producer: types.Producer
): types.Consumer[] {
  return [...consumers.values()].filter(
    (consumer) => consumer.producerId === producer.id
  );
}

export function getProducerConsumer(
  producer: types.Producer,
  transport: types.Transport
): types.Consumer | null {
  const consumer = getTransportConsumers(transport.id).find(
    (consumer) => consumer.producerId === producer.id
  );

  return consumer ?? null;
}
