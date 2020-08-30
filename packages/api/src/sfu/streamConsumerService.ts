import type { Routes, ConsumerInfo } from "../../../types";
import { getConnection } from "../db/repositories/connectionRepository";
import { postToServer } from "./serverService";
import { JsonDecoder } from "ts.data.json";
import {
  createStreamConsumer,
  getStreamConsumer,
  deleteStreamConsumer,
  deleteStreamConsumerByTransportId,
  deleteStreamConsumerBySoourceTransportId,
} from "../db/repositories/streamConsumerRepository";
import { getStream } from "../db/repositories/streamRepository";

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

  const [connection, stream] = await Promise.all([
    getConnection({ connectionId }),
    getStream(data.sourceTransportId, data.producerId),
  ]);

  if (connection === null || connection.recvTransportId === null) {
    throw new Error(
      "onCreateStreamConsumer: connection or recvTransportId does not exists"
    );
  }
  if (stream === null) {
    throw new Error("onCreateStreamConsumer: stream does not exists");
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

  const streamConsumer = await getStreamConsumer(transportId, consumerId);

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

interface CloseConsumerParams {
  transportId: string;
  consumerId: string | null;
  destroy: false;
}

export async function closeConsumer(
  params: CloseConsumerParams
): Promise<void> {
  if (params.consumerId === null) {
    await deleteStreamConsumerByTransportId(params.transportId);
  } else {
    await deleteStreamConsumer(params.transportId, params.consumerId);
  }
}

interface CloseConsumerOfParams {
  sourceTransportId: string;
  destroy: false;
}

export async function closeConsumerOf(
  params: CloseConsumerOfParams
): Promise<void> {
  await deleteStreamConsumerBySoourceTransportId(params.sourceTransportId);
}
