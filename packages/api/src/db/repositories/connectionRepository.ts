import dynamoDb from "../db";
import { Connection } from "../models/connection";

const TableName = "connections";

export async function createConnection(
  connection: Connection
): Promise<Connection> {
  await dynamoDb.put({ TableName, Item: connection }).promise();
  return connection;
}

export async function findByConnectionId(
  connectionId: string
): Promise<Connection | null> {
  const result = await dynamoDb
    .get({ TableName, Key: { connectionId } })
    .promise();
  return (result?.Item ?? null) as Connection | null;
}

export async function getAllConnections(): Promise<Connection[]> {
  const scanOutput = await dynamoDb.scan({ TableName }).promise();
  return scanOutput.Items as Connection[];
}
