import { Server } from "../models/server";
import dynamoDb from "../db";

const TableName = process.env.SERVER_TABLE ?? "";

export async function createServer(server: Server): Promise<Server> {
  // TODO: Use TTL to detect unexpected die to recover
  await dynamoDb.put({ TableName, Item: server }).promise();
  return server;
}

export async function getServer({
  ip,
  port,
}: Pick<Server, "ip" | "port">): Promise<Server | null> {
  const result = await dynamoDb.get({ TableName, Key: { ip, port } }).promise();
  return (result.Item ?? null) as Server | null;
}

export async function getServers(): Promise<Server[]> {
  const result = await dynamoDb.scan({ TableName }).promise();

  return result.Items as Server[];
}

export async function getAllServers(): Promise<Server[]> {
  const scanOutput = await dynamoDb.scan({ TableName }).promise();
  return scanOutput.Items as Server[];
}
