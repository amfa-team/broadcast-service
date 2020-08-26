import type { ConnectionInfo, Routes, ConsumerInfo } from "../../../types";
import { getConnection } from "../db/repositories/connectionRepository";
import { postToServer } from "./serverService";
import { JsonDecoder } from "ts.data.json";
import {
  createStreamConsumer,
  findStreamConsumer,
} from "../db/repositories/streamConsumerRepository";

type CreateStreamConsumerEvent = {
  connectionId: string;
  data: Routes["/receive/create"]["in"];
};

export const decodeRecvParams: JsonDecoder.Decoder<
  Routes["/receive/create"]["in"]
> = JsonDecoder.object(
  {
    transportId: JsonDecoder.string,
    sourceTransportId: JsonDecoder.string,
    producerId: JsonDecoder.string,
    rtpCapabilities: JsonDecoder.succeed,
  },
  "ReceiveParams"
);

export async function onCreateStreamConsumer(
  event: CreateStreamConsumerEvent
): Promise<ConsumerInfo> {
  const { connectionId, data } = event;

  const connection = await getConnection({ connectionId });
  if (connection === null || connection.recvTransportId === null) {
    throw new Error(
      "onCreateStreamConsumer: connection or recvTransportId does not exists"
    );
  }

  const payload: ConsumerInfo = await postToServer("/receive/create", {
    ...data,
    // Force transportId for security reasons
    transportId: connection.recvTransportId,
  });

  // TODO: if exists?
  const streamConsumer = {
    connectionId,
    transportId: connection.recvTransportId,
    sourceTransportId: data.sourceTransportId,
    producerId: data.producerId,
    consumerId: payload.consumerId,
  };

  // TODO: Handle connection/transport removed in between
  await createStreamConsumer(streamConsumer);

  return payload;
}

type ChangeStreamConsumerStateEventData = {
  state: "pause" | "play";
  transportId: string;
  consumerId: string;
};

type ChangeStreamConsumerStateEvent = {
  data: ChangeStreamConsumerStateEventData;
};

export const decodeChangeStreamConsumerStateData: JsonDecoder.Decoder<ChangeStreamConsumerStateEventData> = JsonDecoder.object(
  {
    transportId: JsonDecoder.string,
    consumerId: JsonDecoder.string,
    state: JsonDecoder.oneOf(
      [JsonDecoder.isExactly("play"), JsonDecoder.isExactly("pause")],
      "state"
    ),
  },
  "ChangeStreamConsumerStateEventData"
);

export async function onChangeStreamConsumerState(
  event: ChangeStreamConsumerStateEvent
): Promise<null> {
  const {
    data: { state, transportId, consumerId },
  } = event;
  const streamConsumer = await findStreamConsumer(transportId, consumerId);

  if (streamConsumer === null) {
    return null;
  }

  if (state === "play") {
    await postToServer("/receive/play", { consumerId });
  }
  if (state === "pause") {
    await postToServer("/receive/pause", { consumerId });
  }

  return null;
}
