import {
  SendTransportKey,
  SendTransport,
  PatchSendTransport,
} from "../types/sendTransport";
import { sendTransportModel } from "../schema";

export async function createSendTransport(
  transport: SendTransportKey
): Promise<void> {
  await sendTransportModel.create(transport);
}

export async function deleteSendTransport({
  transportId,
}: SendTransportKey): Promise<void> {
  try {
    await sendTransportModel.delete({ transportId });
  } catch (e) {
    console.error(e);
    throw new Error("deleteSendTransport: failed");
  }
}

export async function getSendTransport({
  transportId,
}: SendTransportKey): Promise<SendTransport | null> {
  const doc = await sendTransportModel.get({ transportId });
  return (doc?.toJSON() ?? null) as SendTransport | null;
}

export async function patchSendTransport(
  params: PatchSendTransport
): Promise<SendTransport> {
  const { transportId, ...rest } = params;
  const doc = await sendTransportModel.update({ transportId }, rest);
  return doc.toJSON() as SendTransport;
}

export async function getAllSendTransport(): Promise<SendTransport[]> {
  const results: unknown = await sendTransportModel.scan().exec();
  return results as SendTransport[];
}
