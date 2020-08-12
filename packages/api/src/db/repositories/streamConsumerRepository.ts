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

export async function deleteStreamConsumerByTransportId(
  transportId: string
): Promise<void> {
  const items = await findStreamConsumerByTransportId(transportId);

  const results = await Promise.allSettled(
    items.map((item) =>
      deleteStreamConsumer(item.sourceTransportId, item.transportId)
    )
  );

  getAllSettledValues(
    results,
    "deleteStreamConsumerByTransportId: Unexpected Error"
  );
}

export async function deleteStreamConsumer(
  sourceTransportId: string,
  transportId: string
): Promise<void> {
  await dynamoDb
    .delete({ TableName, Key: { sourceTransportId, transportId } })
    .promise();
}
