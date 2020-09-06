import type { Routes, ConsumerInfo, ConsumerState } from "../../../types";
import {
  getConnection,
  findConnectionByRecvTransportId,
} from "../db/repositories/connectionRepository";
import { postToServer } from "./serverService";
import { JsonDecoder } from "ts.data.json";
import {
  createStreamConsumer,
  getStreamConsumer,
  deleteStreamConsumer,
  deleteStreamConsumerByTransportId,
  deleteStreamConsumerBySoourceTransportId,
  patchStreamConsumer,
} from "../db/repositories/streamConsumerRepository";
import { getStream } from "../db/repositories/streamRepository";
import { postToConnection } from "../io/io";
import { getAllSettledValues } from "../io/promises";
import { StreamConsumerInfo } from "../db/types/streamConsumer";

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
    score: 0,
    producerScore: 0,
    paused: true,
    producerPaused: false,
  };

  // TODO: Handle connection/transport removed in between
  await createStreamConsumer(streamConsumer);

  // We're forced to get state after, because event might eventually happen in between
  const { score, producerScore, paused, producerPaused } = await postToServer(
    "/receive/state",
    {
      consumerId: payload.consumerId,
    }
  );

  await patchStreamConsumer({
    consumerId: streamConsumer.consumerId,
    transportId: streamConsumer.transportId,
    score,
    producerScore,
    paused,
    producerPaused,
  });

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

interface ConsumerStateChangeEvent {
  transportId: string;
  consumerId: string;
  state: ConsumerState;
}

export async function onConsumerStateChange(
  event: ConsumerStateChangeEvent
): Promise<boolean> {
  const {
    transportId,
    consumerId,
    state: { score, producerScore, paused, producerPaused },
  } = event;

  const [streamConsumer, connections] = await Promise.all([
    getStreamConsumer(transportId, consumerId),
    findConnectionByRecvTransportId(transportId),
  ]);

  if (streamConsumer === null) {
    return false;
  }

  const results = await Promise.allSettled([
    patchStreamConsumer({
      transportId,
      consumerId,
      score,
      producerScore,
      paused,
      producerPaused,
    }),
    ...connections.map((connection) =>
      postToConnection(
        connection.connectionId,
        JSON.stringify({
          type: "event",
          payload: {
            type: "streamConsumer:state",
            data: {
              ...streamConsumer,
              score,
              producerScore,
              paused,
              producerPaused,
            },
          },
        })
      )
    ),
  ]);

  getAllSettledValues<void | StreamConsumerInfo>(
    results,
    "onConsumerStateChange: Unexpected error"
  );

  return true;
}

interface GetConsumerStateParams {
  consumerId: string;
  transportId: string;
}

export async function getStreamConsumerState(
  params: GetConsumerStateParams
): Promise<ConsumerState> {
  const consumer = await getStreamConsumer(
    params.consumerId,
    params.transportId
  );

  return {
    paused: consumer?.paused ?? true,
    producerPaused: consumer?.producerPaused ?? true,
    score: consumer?.score ?? 0,
    producerScore: consumer?.producerScore ?? 0,
  };
}
