import { Server, ServerKey } from "../types/server";
import { serverModel } from "../schema";

export async function createServer(server: Server): Promise<Server> {
  // TODO: Use TTL to detect unexpected die to recover
  const doc = new serverModel(server);
  await doc.save();
  return doc.toJSON() as Server;
}

export async function getServer({
  ip,
  port,
}: ServerKey): Promise<Server | null> {
  // TODO: fix dynamoose typescript for number key
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const key: any = { ip, port };
  const doc = await serverModel.get(key);
  return (doc?.toJSON() ?? null) as Server | null;
}

export async function getAllServers(): Promise<Server[]> {
  const results: unknown = await serverModel.scan().exec();
  return results as Server[];
}