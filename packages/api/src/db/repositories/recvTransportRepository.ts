import { RecvTransportKey, RecvTransport } from "../types/recvTransport";
import { recvTransportModel } from "../schema";

export async function createRecvTransport(
  transport: RecvTransport
): Promise<void> {
  await recvTransportModel.create(transport);
}

export async function deleteRecvTransport({
  transportId,
}: RecvTransportKey): Promise<void> {
  await recvTransportModel.delete({ transportId });
}

export async function getRecvTransport({
  transportId,
}: RecvTransportKey): Promise<RecvTransport | null> {
  const doc = await recvTransportModel.get({ transportId });
  return (doc?.toJSON() ?? null) as RecvTransport | null;
}

export async function getAllRecvTransport(): Promise<RecvTransport[]> {
  const results: unknown = await recvTransportModel.scan().exec();
  return results as RecvTransport[];
}
