import { types } from "mediasoup";

type ProducerMeta = {
  transportId: string;
};

const producers: Map<string, types.Producer> = new Map();
const producersMeta: WeakMap<types.Producer, ProducerMeta> = new WeakMap();

export async function createProducer(
  transport: types.Transport,
  kind: types.MediaKind,
  rtpParameters: types.RtpParameters
): Promise<types.Producer> {
  const producer = await transport.produce({
    kind,
    rtpParameters,
  });

  // Set Producer events.
  // producer.on("score", (score) => {
  //   console.log(
  //     'producer "score" event [producerId:%s, score:%o]',
  //     producer.id,
  //     score
  //   );
  // });

  producer.on("videoorientationchange", (videoOrientation) => {
    console.log(
      'producer "videoorientationchange" event [producerId:%s, videoOrientation:%o]',
      producer.id,
      videoOrientation
    );
  });

  producer.on("transportclose", () => {
    producer.close();
    console.log("transport closed so producer closed");
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
  transport: types.Transport
): types.Producer[] {
  return [...producers.values()].filter(
    (producer) => getProducerMeta(producer).transportId === transport.id
  );
}
