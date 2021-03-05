import type { Server, ServerKey } from "@amfa-team/broadcast-service-types";
import { getModels } from "../../services/mongo/client";

export async function createServer(server: Server): Promise<Server> {
  const { ServerModel } = await getModels();
  // TODO: Use TTL to detect unexpected die to recover
  await ServerModel.updateOne({ ip: server.ip, port: server.port }, server, {
    upsert: true,
  });
  return server;
}

export async function getServer({
  ip,
  port,
}: ServerKey): Promise<Server | null> {
  const { ServerModel } = await getModels();
  // TODO: fix dynamoose typescript for number key
  const doc = await ServerModel.findOne({ ip, port });
  return (doc?.toJSON() ?? null) as Server | null;
}

export async function getAllServers(): Promise<Server[]> {
  const { ServerModel } = await getModels();
  const results = await ServerModel.find();
  return results;
}
