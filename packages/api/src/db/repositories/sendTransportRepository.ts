import type {
  PatchSendTransport,
  SendTransport,
  SendTransportKey,
} from "@amfa-team/broadcast-service-types";
import PicnicError from "../../io/exceptions/PicnicError";
import { getModels } from "../../services/mongo/client";

export async function createSendTransport(
  transport: SendTransportKey,
): Promise<void> {
  const { SendTransportModel } = await getModels();
  await SendTransportModel.create(transport);
}

export async function deleteSendTransport({
  _id,
}: SendTransportKey): Promise<void> {
  try {
    const { SendTransportModel } = await getModels();
    await SendTransportModel.deleteOne({ _id });
  } catch (e) {
    throw new PicnicError("deleteSendTransport: failed", e);
  }
}

export async function getSendTransport({
  _id,
}: SendTransportKey): Promise<SendTransport | null> {
  const { SendTransportModel } = await getModels();
  const doc = await SendTransportModel.findById(_id);
  return (doc?.toJSON() ?? null) as SendTransport | null;
}

export async function patchSendTransport(
  params: PatchSendTransport,
): Promise<SendTransport> {
  const { SendTransportModel } = await getModels();
  const { _id, ...rest } = params;
  await SendTransportModel.updateOne({ _id }, rest);
  const doc = await SendTransportModel.findById(_id);
  return (doc?.toJSON() ?? null) as SendTransport;
}

export async function getAllSendTransport(): Promise<SendTransport[]> {
  const { SendTransportModel } = await getModels();
  const results = await SendTransportModel.find();
  return results;
}
