import type { Routes, StreamInfo } from "../../../types";
import { getConnection } from "../db/repositories/connectionRepository";
import { postToServer } from "./serverService";
import {
  createStream,
  getStream,
  deleteStream,
  deleteStreamByTransportId,
  patchStream,
} from "../db/repositories/streamRepository";
import { broadcastToConnections } from "../io/io";
import { RequestContext } from "../io/types";
import { JsonDecoder } from "ts.data.json";
import { getAllSettledValues } from "../io/promises";
import { closeConsumerOf } from "./streamConsumerService";

type CreateStreamEvent = {
  connectionId: string;
  data: Routes["/send/create"]["in"];
  requestContext: RequestContext;
};

export const decodeSendParams: JsonDecoder.Decoder<
  Routes["/send/create"]["in"]
> = JsonDecoder.object(
  {
    transportId: JsonDecoder.string,
    kind: JsonDecoder.oneOf(
      [JsonDecoder.isExactly("audio"), JsonDecoder.isExactly("video")],
      "kind"
    ),
    rtpParameters: JsonDecoder.succeed,
  },
  "SendParams"
);

export async function onCreateStream(
  event: CreateStreamEvent
): Promise<string> {
  const { connectionId, data, requestContext } = event;

  const connection = await getConnection({ connectionId });
  if (connection === null || connection.sendTransportId === null) {
    throw new Error(
      "onCreateStream: connection or sendTransportId does not exists"
    );
  }

  const producerId: string = await postToServer("/send/create", {
    ...data,
    // Force transportId for security reasons
    transportId: connection.sendTransportId,
  });

  // TODO: if exists?
  const stream = {
    transportId: connection.sendTransportId,
    producerId: producerId,
    kind: data.kind,
    score: 0,
  };

  // TODO: Handle connection/transport removed in between
  await createStream(stream);

  await broadcastToConnections(
    requestContext,
    JSON.stringify({
      type: "event",
      payload: {
        type: "stream:add",
        data: stream,
      },
    })
  );

  return producerId;
}

type OnChangeStreamStateEventData = {
  transportId: string;
  producerId: string;
  state: "close";
};

type OnChangeStreamStateEvent = {
  connectionId: string;
  data: OnChangeStreamStateEventData;
  requestContext: RequestContext;
};

export const decodeOnChangeStreamStateData: JsonDecoder.Decoder<OnChangeStreamStateEventData> = JsonDecoder.object(
  {
    transportId: JsonDecoder.string,
    producerId: JsonDecoder.string,
    state: JsonDecoder.isExactly("close"),
  },
  "ChangeStreamStateEventData"
);

export async function onChangeStreamState(
  event: OnChangeStreamStateEvent
): Promise<null> {
  const {
    requestContext,
    data: { state, transportId, producerId },
  } = event;
  const stream = await getStream(transportId, producerId);

  if (stream === null || state !== "close") {
    return null;
  }

  // TODO: Check connectionId?

  const results = await Promise.allSettled([
    postToServer("/send/destroy", { transportId, producerId }),
    deleteStream(transportId, producerId),
    broadcastToConnections(
      requestContext,
      JSON.stringify({
        type: "event",
        payload: {
          type: "stream:remove",
          data: transportId,
        },
      })
    ),
  ]);

  getAllSettledValues(results, "onChangeStreamState: Unexpected error");

  return null;
}

interface CloseStreamParams {
  transportId: string;
  // Specific producer Id not supported yet
  producerId: null;
  destroy: false;
  requestContext: RequestContext;
}

export async function closeStream(params: CloseStreamParams): Promise<void> {
  const results = await Promise.allSettled([
    deleteStreamByTransportId(params.transportId),
    closeConsumerOf({ sourceTransportId: params.transportId, destroy: false }),
    broadcastToConnections(
      params.requestContext,
      JSON.stringify({
        type: "event",
        payload: {
          type: "stream:remove",
          data: params.transportId,
        },
      })
    ),
  ]);

  getAllSettledValues(results, "closeStream: Unexpected error");
}

interface ScoreChangeEvent {
  transportId: string;
  producerId: string;
  requestContext: RequestContext;
  score: number;
}

export async function onScoreChange(event: ScoreChangeEvent): Promise<void> {
  const { transportId, producerId, score, requestContext } = event;

  const stream = await getStream(transportId, producerId);

  if (stream === null) {
    // Ignore, this is probably happening on close
    console.log("Not found wesh", {
      transportId,
      producerId,
      score,
      requestContext,
    });
    return;
  }

  const results = await Promise.allSettled([
    patchStream({ transportId, producerId, score }),
    broadcastToConnections(
      requestContext,
      JSON.stringify({
        type: "event",
        payload: {
          type: "stream:quality",
          data: {
            transportId,
            producerId,
            kind: stream.kind,
            score,
          },
        },
      })
    ),
  ]);

  getAllSettledValues<void | StreamInfo>(
    results,
    "onScoreChange: Unexpected error"
  );
}
