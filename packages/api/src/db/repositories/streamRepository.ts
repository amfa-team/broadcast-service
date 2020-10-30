import type { PatchStream, StreamInfo } from "@amfa-team/types";
import { StreamModel } from "../schema";

export async function createStream(stream: StreamInfo): Promise<StreamInfo> {
  const doc = await StreamModel.create(stream);
  return doc.toJSON() as StreamInfo;
}

export async function deleteStream(
  transportId: string,
  producerId: string,
): Promise<void> {
  await StreamModel.delete({ transportId, producerId });
}

export async function getStream(
  transportId: string,
  producerId: string,
): Promise<StreamInfo | null> {
  const doc = await StreamModel.get({ transportId, producerId });
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (doc?.toJSON() ?? null) as StreamInfo | null;
}

export async function findStreamByTransportId(
  transportId: string,
): Promise<StreamInfo[]> {
  const results: unknown = await StreamModel.scan({
    transportId: { eq: transportId },
  }).exec();
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
  const results: unknown = await StreamModel.scan().exec();
  return results as StreamInfo[];
}

export async function patchStream(params: PatchStream): Promise<StreamInfo> {
  const { transportId, producerId, ...rest } = params;
  const doc = await StreamModel.update({ transportId, producerId }, rest);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (doc?.toJSON() ?? null) as StreamInfo;
}
