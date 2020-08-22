import dynamoDb from "../db";
import { StreamInfo } from "../models/stream";

const TableName = process.env.STREAM_TABLE ?? "";

export async function createStream(stream: StreamInfo): Promise<StreamInfo> {
  await dynamoDb.put({ TableName, Item: stream }).promise();
  return stream;
}

export async function deleteStream(
  transportId: string,
  producerId: string
): Promise<void> {
  await dynamoDb
    .delete({ TableName, Key: { transportId, producerId } })
    .promise();
}

export async function getStream(
  transportId: string,
  producerId: string
): Promise<StreamInfo | null> {
  const result = await dynamoDb
    .get({ TableName, Key: { transportId, producerId } })
    .promise();
  return (result.Item ?? null) as StreamInfo | null;
}

export async function findByTransportId(
  transportId: string
): Promise<StreamInfo[]> {
  const result = await dynamoDb
    .scan({
      TableName,
      FilterExpression: "transportId = :id",
      ExpressionAttributeValues: {
        ":id": transportId,
      },
    })
    .promise();
  return result?.Items as StreamInfo[];
}

export async function deleteByTransportId(transportId: string): Promise<void> {
  const items = await findByTransportId(transportId);

  await Promise.all(
    items.map((item) => deleteStream(item.transportId, item.producerId))
  );
}

export async function getAllStreams(): Promise<StreamInfo[]> {
  const scanOutput = await dynamoDb.scan({ TableName }).promise();
  return scanOutput.Items as StreamInfo[];
}

export async function deleteConnection(connectionId: string): Promise<void> {
  await dynamoDb.delete({ TableName, Key: { connectionId } }).promise();
}
