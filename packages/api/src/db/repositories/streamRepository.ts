import type {
  PatchStream,
  StreamInfo,
} from "@amfa-team/broadcast-service-types";
import { getModels } from "../../services/mongo/client";

export async function createStream(stream: StreamInfo): Promise<StreamInfo> {
  const { StreamModel } = await getModels();
  const doc = await StreamModel.create(stream);
  return doc.toJSON() as StreamInfo;
}

export async function deleteStream(
  transportId: string,
  producerId: string,
): Promise<void> {
  const { StreamModel } = await getModels();
  await StreamModel.deleteOne({ transportId, producerId });
}

export async function getStream(
  transportId: string,
  producerId: string,
): Promise<StreamInfo | null> {
  const { StreamModel } = await getModels();
  const doc = await StreamModel.findOne({ transportId, producerId });
  return (doc?.toJSON() ?? null) as StreamInfo | null;
}

export async function findStreamByTransportId(
  transportId: string,
): Promise<StreamInfo[]> {
  const { StreamModel } = await getModels();
  const results = await StreamModel.find({ transportId });
  return results as StreamInfo[];
}

export async function deleteStreamByTransportId(
  transportId: string,
): Promise<void> {
  const items = await findStreamByTransportId(transportId);

  await Promise.all(
    items.map(async (item) => deleteStream(item.transportId, item.producerId)),
  );
}

export async function getAllStreams(): Promise<StreamInfo[]> {
  const { StreamModel } = await getModels();
  const results = await StreamModel.find();
  return results as StreamInfo[];
}

export async function patchStream(params: PatchStream): Promise<StreamInfo> {
  const { transportId, producerId, ...rest } = params;
  const { StreamModel } = await getModels();
  await StreamModel.updateOne({ transportId, producerId }, rest);
  const doc = await StreamModel.findOne({ transportId, producerId });
  return (doc?.toJSON() ?? null) as StreamInfo;
}
