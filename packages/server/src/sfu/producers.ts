import { types } from "mediasoup";
import { getTransport } from "./transport";

const producers: Map<string, types.Producer> = new Map();

export async function createProducer(
  transportId: string,
  kind: types.MediaKind,
  rtpParameters: types.RtpParameters
): Promise<types.Producer> {
  const producer = await getTransport(transportId).produce({
    kind,
    rtpParameters,
  });

  // Set Producer events.
  producer.on("score", (score) => {
    console.log(
      'producer "score" event [producerId:%s, score:%o]',
      producer.id,
      score
    );
  });

  producer.on("videoorientationchange", (videoOrientation) => {
    console.log(
      'producer "videoorientationchange" event [producerId:%s, videoOrientation:%o]',
      producer.id,
      videoOrientation
    );
  });

  producer.on("transportclose", () => {
    producers.delete(producer.id);
    console.log("transport closed so producer closed");
  });

  producers.set(producer.id, producer);

  return producer;
}
