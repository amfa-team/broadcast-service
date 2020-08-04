import { Server } from "../models/server";
import dynamoDb from "../db";

const TableName = "servers";

export async function createServer(server: Server): Promise<Server> {
  // TODO: Use TTL to detect unexpected die to recover
  await dynamoDb.put({ TableName, Item: server }).promise();
  return server;
}

export async function getServers(): Promise<Server[]> {
  const result = await dynamoDb.scan({ TableName }).promise();

  return result.Items as Server[];
}

export async function getAllServers(): Promise<Server[]> {
  const scanOutput = await dynamoDb.scan({ TableName }).promise();
  return scanOutput.Items as Server[];
}
