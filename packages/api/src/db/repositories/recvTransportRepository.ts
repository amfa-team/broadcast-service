import type {
  RecvTransport,
  RecvTransportKey,
} from "@amfa-team/broadcast-service-types";
import { RecvTransportModel } from "../schema";

export async function createRecvTransport(
  transport: RecvTransport,
): Promise<void> {
  await RecvTransportModel.create(transport);
}

export async function deleteRecvTransport({
  transportId,
}: RecvTransportKey): Promise<void> {
  await RecvTransportModel.delete({ transportId });
}

export async function getRecvTransport({
  transportId,
}: RecvTransportKey): Promise<RecvTransport | null> {
  const doc = await RecvTransportModel.get({ transportId });
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (doc?.toJSON() ?? null) as RecvTransport | null;
}

export async function getAllRecvTransport(): Promise<RecvTransport[]> {
  const results: unknown = await RecvTransportModel.scan().exec();
  return results as RecvTransport[];
}
