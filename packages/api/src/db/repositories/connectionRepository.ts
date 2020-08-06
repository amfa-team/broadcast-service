import dynamoDb from "../db";
import {
  CreateConnection,
  Connection,
  UpdateConnection,
} from "../models/connection";

const TableName = "connections";

export async function createConnection(
  params: CreateConnection
): Promise<Connection> {
  const connection: Connection = {
    ...params,
    transportId: null,
  };
  await dynamoDb.put({ TableName, Item: connection }).promise();
  return connection;
}

export async function deleteConnection(connectionId: string): Promise<void> {
  await dynamoDb.delete({ TableName, Key: { connectionId } }).promise();
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

export async function updateConnection(
  params: UpdateConnection
): Promise<Connection> {
  const previousConnection = await findByConnectionId(params.connectionId);
  if (previousConnection === null) {
    throw new Error(
      "connectionRepository.updateConnection: connection not found"
    );
  }

  // TODO: Possible edge case where connection is modify between
  const connection: Connection = {
    ...previousConnection,
    ...params,
  };
  await dynamoDb.put({ TableName, Item: connection }).promise();

  return connection;
}
