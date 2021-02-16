import type {
  PatchStreamConsumer,
  StreamConsumerInfo,
} from "@amfa-team/broadcast-service-types";
import PicnicError from "../../io/exceptions/PicnicError";
import { getAllSettledValues } from "../../io/promises";
import { getModels } from "../../services/mongo/client";

export async function createStreamConsumer(
  stream: StreamConsumerInfo,
): Promise<StreamConsumerInfo> {
  try {
    const { StreamConsumerModel } = await getModels();
    const doc = await StreamConsumerModel.create(stream);
    return doc.toJSON() as StreamConsumerInfo;
  } catch (e) {
    throw new PicnicError("createStreamConsumer: failed", e);
  }
}

export async function getAllStreamConsumers(): Promise<StreamConsumerInfo[]> {
  try {
    const { StreamConsumerModel } = await getModels();
    const results = await StreamConsumerModel.find();
    return results;
  } catch (e) {
    throw new PicnicError("getAllStreamConsumers: failed", e);
  }
}

export async function findStreamConsumerByTransportId(
  transportId: string,
): Promise<StreamConsumerInfo[]> {
  try {
    const { StreamConsumerModel } = await getModels();
    const results = await StreamConsumerModel.find({
      transportId,
    });
    return results as StreamConsumerInfo[];
  } catch (e) {
    throw new PicnicError("findStreamConsumerByTransportId: failed", e);
  }
}

export async function findStreamConsumerBySourceTransportId(
  sourceTransportId: string,
): Promise<StreamConsumerInfo[]> {
  try {
    const { StreamConsumerModel } = await getModels();
    const results = await StreamConsumerModel.find({
      sourceTransportId,
    });
    return results as StreamConsumerInfo[];
  } catch (e) {
    throw new PicnicError("findStreamConsumerBySourceTransportId: failed", e);
  }
}

export async function getStreamConsumer(
  transportId: string,
  consumerId: string,
): Promise<StreamConsumerInfo | null> {
  try {
    const { StreamConsumerModel } = await getModels();
    const result = await StreamConsumerModel.findOne({
      transportId,
      consumerId,
    });
    return (result?.toJSON() ?? null) as StreamConsumerInfo | null;
  } catch (e) {
    throw new PicnicError("getStreamConsumer: failed", e);
  }
}

export async function deleteStreamConsumer(
  transportId: string,
  consumerId: string,
): Promise<void> {
  try {
    const { StreamConsumerModel } = await getModels();
    await StreamConsumerModel.deleteOne({ consumerId, transportId });
  } catch (e) {
    throw new PicnicError("deleteStreamConsumer: failed", e);
  }
}

export async function deleteStreamConsumerByTransportId(
  transportId: string,
): Promise<void> {
  const items = await findStreamConsumerByTransportId(transportId);

  const results = await Promise.allSettled(
    items.map(async (item) =>
      deleteStreamConsumer(item.transportId, item.consumerId),
    ),
  );

  getAllSettledValues(
    results,
    "deleteStreamConsumerByTransportId: Unexpected Error",
  );
}

export async function deleteStreamConsumerBySoourceTransportId(
  sourceTransportId: string,
): Promise<void> {
  const items = await findStreamConsumerBySourceTransportId(sourceTransportId);

  const results = await Promise.allSettled(
    items.map(async (item) =>
      deleteStreamConsumer(item.transportId, item.consumerId),
    ),
  );

  getAllSettledValues(
    results,
    "deleteStreamConsumerBySoourceTransportId: Unexpected Error",
  );
}

export async function patchStreamConsumer(
  params: PatchStreamConsumer,
): Promise<StreamConsumerInfo> {
  const { transportId, consumerId, ...rest } = params;
  const { StreamConsumerModel } = await getModels();
  await StreamConsumerModel.updateOne({ transportId, consumerId }, rest);
  const doc = await StreamConsumerModel.findOne({ transportId, consumerId });
  return (doc?.toJSON() ?? null) as StreamConsumerInfo;
}
