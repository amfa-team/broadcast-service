import { types } from "mediasoup";

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
    console.log("transport closed so consumer closed");
  });

  consumer.on("producerclose", () => {
    consumer.close();
    console.log("associated producer closed so consumer closed");
  });

  consumer.on("producerresume", () => {
    console.log("associated producer paused");
  });

  consumer.on("producerpause", () => {
    console.log("associated producer paused");
  });

  consumer.observer.on("close", () => {
    consumers.delete(consumer.id);
  });

  // consumer.on("score", (score) => {
  //   console.log(
  //     'consumer "score" event [consumerId:%s, score:%o]',
  //     consumer.id,
  //     score
  //   );
  // });

  // consumer.on("layerschange", (layers) => {
  //   console.log('consumer "layerschange" event', consumer.id, layers);
  // });

  // TODO: unset consumer onclose
  consumers.set(consumer.id, consumer);
  consumersMeta.set(consumer, { transportId: transport.id });

  return consumer;
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
