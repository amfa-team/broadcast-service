import dynamoDb from "../db";
import { StreamConsumerInfo } from "../models/streamConsumer";
import { getAllSettledValues } from "../../io/promises";

const TableName = "consumer-streams";

export async function createStreamConsumer(
  stream: StreamConsumerInfo
): Promise<StreamConsumerInfo> {
  await dynamoDb.put({ TableName, Item: stream }).promise();
  return stream;
}

export async function getStreamConsumers(): Promise<StreamConsumerInfo[]> {
  const scanOutput = await dynamoDb.scan({ TableName }).promise();
  return scanOutput.Items as StreamConsumerInfo[];
}

export async function findStreamConsumerByTransportId(
  transportId: string
): Promise<StreamConsumerInfo[]> {
  const result = await dynamoDb
    .scan({
      TableName,
      FilterExpression: "transportId = :id",
      ExpressionAttributeValues: {
        ":id": transportId,
      },
    })
    .promise();

  return result.Items as StreamConsumerInfo[];
}

export async function findStreamConsumer(
  transportId: string,
  consumerId: string
): Promise<StreamConsumerInfo | null> {
  const result = await dynamoDb
    .get({
      TableName,
      Key: { transportId, consumerId },
    })
    .promise();

  return (result.Item ?? null) as StreamConsumerInfo | null;
}

export async function deleteStreamConsumerByTransportId(
  transportId: string
): Promise<void> {
  const items = await findStreamConsumerByTransportId(transportId);

  const results = await Promise.allSettled(
    items.map((item) => deleteStreamConsumer(item.transportId, item.consumerId))
  );

  getAllSettledValues(
    results,
    "deleteStreamConsumerByTransportId: Unexpected Error"
  );
}

export async function deleteStreamConsumer(
  transportId: string,
  consumerId: string
): Promise<void> {
  await dynamoDb
    .delete({ TableName, Key: { consumerId, transportId } })
    .promise();
}
