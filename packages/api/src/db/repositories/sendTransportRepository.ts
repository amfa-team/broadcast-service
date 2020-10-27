import type {
  PatchSendTransport,
  SendTransport,
  SendTransportKey,
} from "@amfa-team/types";
import PicnicError from "../../io/exceptions/PicnicError";
import { SendTransportModel } from "../schema";

export async function createSendTransport(
  transport: SendTransportKey,
): Promise<void> {
  await SendTransportModel.create(transport);
}

export async function deleteSendTransport({
  transportId,
}: SendTransportKey): Promise<void> {
  try {
    await SendTransportModel.delete({ transportId });
  } catch (e) {
    throw new PicnicError("deleteSendTransport: failed", e);
  }
}

export async function getSendTransport({
  transportId,
}: SendTransportKey): Promise<SendTransport | null> {
  const doc = await SendTransportModel.get({ transportId });
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (doc?.toJSON() ?? null) as SendTransport | null;
}

export async function patchSendTransport(
  params: PatchSendTransport,
): Promise<SendTransport> {
  const { transportId, ...rest } = params;
  const doc = await SendTransportModel.update({ transportId }, rest);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (doc?.toJSON() ?? null) as SendTransport;
}

export async function getAllSendTransport(): Promise<SendTransport[]> {
  const results: unknown = await SendTransportModel.scan().exec();
  return results as SendTransport[];
}
