import {
  StreamConsumerInfo,
  PatchStreamConsumer,
} from "../types/streamConsumer";
import { getAllSettledValues } from "../../io/promises";
import { streamConsumerModel } from "../schema";
import { PicnicError } from "../../io/exceptions";

const INDEX_SOURCE_TRANSPORT =
  process.env.STREAM_CONSUMER_TABLE_INDEX_SOURCE_TRANSPORT ?? "";

export async function createStreamConsumer(
  stream: StreamConsumerInfo
): Promise<StreamConsumerInfo> {
  try {
    const doc = await streamConsumerModel.create(stream);
    return doc.toJSON() as StreamConsumerInfo;
  } catch (e) {
    throw new PicnicError("createStreamConsumer: failed", e);
  }
}

export async function getAllStreamConsumers(): Promise<StreamConsumerInfo[]> {
  try {
    const results: unknown = await streamConsumerModel.scan().exec();
    return results as StreamConsumerInfo[];
  } catch (e) {
    throw new PicnicError("getAllStreamConsumers: failed", e);
  }
}

export async function findStreamConsumerByTransportId(
  transportId: string
): Promise<StreamConsumerInfo[]> {
  try {
    const results: unknown = await streamConsumerModel
      .query({ transportId: { eq: transportId } })
      .exec();
    return results as StreamConsumerInfo[];
  } catch (e) {
    throw new PicnicError("findStreamConsumerByTransportId: failed", e);
  }
}

export async function findStreamConsumerBySourceTransportId(
  sourceTransportId: string
): Promise<StreamConsumerInfo[]> {
  try {
    const results: unknown = await streamConsumerModel
      .query({ sourceTransportId: { eq: sourceTransportId } })
      .using(INDEX_SOURCE_TRANSPORT)
      .exec();
    return results as StreamConsumerInfo[];
  } catch (e) {
    throw new PicnicError("findStreamConsumerBySourceTransportId: failed", e);
  }
}

export async function getStreamConsumer(
  transportId: string,
  consumerId: string
): Promise<StreamConsumerInfo | null> {
  try {
    const result = await streamConsumerModel.get({ transportId, consumerId });
    return (result?.toJSON() ?? null) as StreamConsumerInfo | null;
  } catch (e) {
    throw new PicnicError("getStreamConsumer: failed", e);
  }
}

export async function deleteStreamConsumerByTransportId(
  transportId: string
): Promise<void> {
  const items = await findStreamConsumerByTransportId(transportId);

  const results = await Promise.allSettled(
    items.map((item) => deleteStreamConsumer(item.transportId, item.consumerId))
  );

  getAllSettledValues(
    results,
    "deleteStreamConsumerByTransportId: Unexpected Error"
  );
}

export async function deleteStreamConsumerBySoourceTransportId(
  sourceTransportId: string
): Promise<void> {
  const items = await findStreamConsumerBySourceTransportId(sourceTransportId);

  const results = await Promise.allSettled(
    items.map((item) => deleteStreamConsumer(item.transportId, item.consumerId))
  );

  getAllSettledValues(
    results,
    "deleteStreamConsumerBySoourceTransportId: Unexpected Error"
  );
}

export async function deleteStreamConsumer(
  transportId: string,
  consumerId: string
): Promise<void> {
  try {
    await streamConsumerModel.delete({ consumerId, transportId });
  } catch (e) {
    throw new PicnicError("deleteStreamConsumer: failed", e);
  }
}

export async function patchStreamConsumer(
  params: PatchStreamConsumer
): Promise<StreamConsumerInfo> {
  const { transportId, consumerId, ...rest } = params;
  const doc = await streamConsumerModel.update(
    { transportId, consumerId },
    rest
  );
  return doc.toJSON() as StreamConsumerInfo;
}
