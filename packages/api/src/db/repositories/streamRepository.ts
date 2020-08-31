import { StreamInfo, PatchStream } from "../types/stream";
import { streamModel } from "../schema";

export async function createStream(stream: StreamInfo): Promise<StreamInfo> {
  const doc = await streamModel.create(stream);
  return doc.toJSON() as StreamInfo;
}

export async function deleteStream(
  transportId: string,
  producerId: string
): Promise<void> {
  await streamModel.delete({ transportId, producerId });
}

export async function getStream(
  transportId: string,
  producerId: string
): Promise<StreamInfo | null> {
  const doc = await streamModel.get({ transportId, producerId });
  return (doc?.toJSON() ?? null) as StreamInfo | null;
}

export async function findStreamByTransportId(
  transportId: string
): Promise<StreamInfo[]> {
  const results: unknown = await streamModel
    .scan({ transportId: { eq: transportId } })
    .exec();
  return results as StreamInfo[];
}

export async function deleteStreamByTransportId(
  transportId: string
): Promise<void> {
  const items = await findStreamByTransportId(transportId);

  await Promise.all(
    items.map((item) => deleteStream(item.transportId, item.producerId))
  );
}

export async function getAllStreams(): Promise<StreamInfo[]> {
  const results: unknown = await streamModel.scan().exec();
  return results as StreamInfo[];
}

export async function patchStream(params: PatchStream): Promise<StreamInfo> {
  const { transportId, producerId, ...rest } = params;
  const doc = await streamModel.update({ transportId, producerId }, rest);
  return doc.toJSON() as StreamInfo;
}
