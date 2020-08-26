import dynamoDb from "../db";
import {
  CreateConnection,
  Connection,
  ConnectionKey,
  PatchConnection,
} from "../models/connection";

const TableName = process.env.CONNECTION_TABLE ?? "";

export async function createConnection(
  params: CreateConnection
): Promise<Connection> {
  const connection: Connection = {
    ...params,
    sendTransportId: null,
    recvTransportId: null,
  };
  await dynamoDb.put({ TableName, Item: connection }).promise();
  return connection;
}

export async function deleteConnection({
  connectionId,
}: ConnectionKey): Promise<void> {
  await dynamoDb.delete({ TableName, Key: { connectionId } }).promise();
}

export async function getConnection({
  connectionId,
}: ConnectionKey): Promise<Connection | null> {
  const result = await dynamoDb
    .get({ TableName, Key: { connectionId } })
    .promise();
  return (result?.Item ?? null) as Connection | null;
}

export async function getAllConnections(): Promise<Connection[]> {
  const scanOutput = await dynamoDb.scan({ TableName }).promise();
  return scanOutput.Items as Connection[];
}

export async function patchConnection(
  params: PatchConnection
): Promise<Connection> {
  const previousConnection = await getConnection(params);
  if (previousConnection === null) {
    throw new Error(
      "connectionRepository.patchConnection: connection not found"
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
