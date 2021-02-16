import type {
  RecvTransport,
  RecvTransportKey,
} from "@amfa-team/broadcast-service-types";
import { getModels } from "../../services/mongo/client";

export async function createRecvTransport(
  transport: RecvTransport,
): Promise<void> {
  const { RecvTransportModel } = await getModels();
  await RecvTransportModel.create(transport);
}

export async function deleteRecvTransport({
  _id,
}: RecvTransportKey): Promise<void> {
  const { RecvTransportModel } = await getModels();
  await RecvTransportModel.deleteOne({ _id });
}

export async function getRecvTransport({
  _id,
}: RecvTransportKey): Promise<RecvTransport | null> {
  const { RecvTransportModel } = await getModels();
  const doc = await RecvTransportModel.findById(_id);
  return (doc?.toJSON() ?? null) as RecvTransport | null;
}

export async function getAllRecvTransport(): Promise<RecvTransport[]> {
  const { RecvTransportModel } = await getModels();
  const results = await RecvTransportModel.find();
  return results;
}
