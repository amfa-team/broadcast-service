import { types } from "mediasoup";
import { getTransport } from "./transport";

const consumers: Map<string, types.Consumer> = new Map();

export async function createConsumer(
  transportId: string,
  producerId: string,
  rtpCapabilities: types.RtpCapabilities
): Promise<types.Consumer> {
  const consumer = await getTransport(transportId).consume({
    producerId,
    rtpCapabilities,
  });

  consumer.on("transportclose", () => {
    console.log("transport closed so consumer closed");
  });

  consumer.on("producerclose", () => {
    console.log("associated producer closed so consumer closed");
  });

  consumer.on("producerresume", () => {
    console.log("associated producer paused");
  });

  consumer.on("producerpause", () => {
    console.log("associated producer paused");
  });

  consumer.on("score", (score) => {
    console.log(
      'consumer "score" event [consumerId:%s, score:%o]',
      consumer.id,
      score
    );
  });

  consumer.on("layerschange", (layers) => {
    console.log('consumer "layerschange" event', consumer.id, layers);
  });

  consumers.set(consumer.id, consumer);

  return consumer;
}
