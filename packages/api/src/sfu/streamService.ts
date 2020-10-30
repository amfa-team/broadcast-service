import type { ProducerState, Routes, StreamInfo } from "@amfa-team/types";
import { JsonDecoder } from "ts.data.json";
import { getConnection } from "../db/repositories/connectionRepository";
import {
  createStream,
  deleteStream,
  deleteStreamByTransportId,
  getStream,
  patchStream,
} from "../db/repositories/streamRepository";
import { broadcastToConnections } from "../io/io";
import { getAllSettledValues } from "../io/promises";
import { postToServer } from "./serverService";
import { closeConsumerOf } from "./streamConsumerService";

type CreateStreamEvent = {
  connectionId: string;
  data: Routes["/send/create"]["in"];
};

export const decodeSendParams: JsonDecoder.Decoder<
  Routes["/send/create"]["in"]
> = JsonDecoder.object(
  {
    transportId: JsonDecoder.string,
    kind: JsonDecoder.oneOf(
      [JsonDecoder.isExactly("audio"), JsonDecoder.isExactly("video")],
      "kind",
    ),
    rtpParameters: JsonDecoder.succeed,
  },
  "SendParams",
);

export async function onCreateStream(
  event: CreateStreamEvent,
): Promise<string> {
  const { connectionId, data } = event;

  const connection = await getConnection({ connectionId });
  if (connection === null || connection.sendTransportId === null) {
    throw new Error(
      "onCreateStream: connection or sendTransportId does not exists",
    );
  }

  const producerId = await postToServer("/send/create", {
    ...data,
    // Force transportId for security reasons
    transportId: connection.sendTransportId,
  });

  // TODO: if exists?
  const stream = {
    transportId: connection.sendTransportId,
    producerId,
    kind: data.kind,
    score: 0,
    paused: false,
  };

  // TODO: Handle connection/transport removed in between
  await createStream(stream);

  // We're forced to get score after, because event might eventually happen in between
  const { score, paused } = await postToServer("/send/state", { producerId });

  const results = await Promise.allSettled([
    patchStream({ ...stream, score }),
    broadcastToConnections(
      JSON.stringify({
        type: "event",
        payload: {
          type: "stream:add",
          data: { ...stream, score, paused },
        },
      }),
    ),
  ]);

  getAllSettledValues<StreamInfo | void>(
    results,
    "onCreateStream: Unexpected error",
  );

  return producerId;
}

type OnChangeStreamStateEventData = {
  transportId: string;
  producerId: string;
  state: "close" | "pause" | "play";
};

type OnChangeStreamStateEvent = {
  connectionId: string;
  data: OnChangeStreamStateEventData;
};

export const decodeOnChangeStreamStateData: JsonDecoder.Decoder<OnChangeStreamStateEventData> = JsonDecoder.object(
  {
    transportId: JsonDecoder.string,
    producerId: JsonDecoder.string,
    state: JsonDecoder.oneOf(
      [
        JsonDecoder.isExactly("close"),
        JsonDecoder.isExactly("pause"),
        JsonDecoder.isExactly("play"),
      ],
      "state",
    ),
  },
  "ChangeStreamStateEventData",
);

export async function onChangeStreamState(
  event: OnChangeStreamStateEvent,
): Promise<null> {
  const {
    data: { state, transportId, producerId },
  } = event;
  const stream = await getStream(transportId, producerId);

  if (stream === null) {
    return null;
  }

  // TODO: Check connectionId?
  if (state === "play") {
    await postToServer("/send/play", { producerId });
  }
  if (state === "pause") {
    await postToServer("/send/pause", { producerId });
  }
  if (state === "close") {
    const results = await Promise.allSettled([
      postToServer("/send/destroy", { transportId, producerId, delay: 120000 }),
      deleteStream(transportId, producerId),
      broadcastToConnections(
        JSON.stringify({
          type: "event",
          payload: {
            type: "stream:remove",
            data: transportId,
          },
        }),
      ),
    ]);

    getAllSettledValues(results, "onChangeStreamState: Unexpected error");
  }

  return null;
}

interface CloseStreamParams {
  transportId: string;
  // Specific producer Id not supported yet
  producerId: null;
  destroy: false;
}

export async function closeStream(params: CloseStreamParams): Promise<void> {
  const results = await Promise.allSettled([
    deleteStreamByTransportId(params.transportId),
    closeConsumerOf({ sourceTransportId: params.transportId, destroy: false }),
    broadcastToConnections(
      JSON.stringify({
        type: "event",
        payload: {
          type: "stream:remove",
          data: params.transportId,
        },
      }),
    ),
  ]);

  getAllSettledValues(results, "closeStream: Unexpected error");
}

interface ProducerStateChangeEvent {
  transportId: string;
  producerId: string;
  state: ProducerState;
}

export async function onProducerStateChange(
  event: ProducerStateChangeEvent,
): Promise<boolean> {
  const {
    transportId,
    producerId,
    state: { score, paused },
  } = event;

  const stream = await getStream(transportId, producerId);

  if (stream === null) {
    return false;
  }

  const results = await Promise.allSettled([
    patchStream({ transportId, producerId, score, paused }),
    broadcastToConnections(
      JSON.stringify({
        type: "event",
        payload: {
          type: "stream:state",
          data: {
            ...stream,
            score,
            paused,
          },
        },
      }),
    ),
  ]);

  getAllSettledValues<void | StreamInfo>(
    results,
    "onProducerStateChange: Unexpected error",
  );

  return true;
}
