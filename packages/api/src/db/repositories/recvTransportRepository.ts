import dynamoDb from "../db";
import { RecvTransportKey, RecvTransport } from "../models/recvTransport";

const TableName = process.env.RECV_TRANSPORT_TABLE ?? "";

export async function createRecvTransport(
  transport: RecvTransport
): Promise<void> {
  await dynamoDb.put({ TableName, Item: transport }).promise();
}

export async function deleteRecvTransport({
  transportId,
}: RecvTransportKey): Promise<void> {
  await dynamoDb.delete({ TableName, Key: { transportId } }).promise();
}

export async function getRecvTransport({
  transportId,
}: RecvTransportKey): Promise<RecvTransport | null> {
  const result = await dynamoDb
    .get({ TableName, Key: { transportId } })
    .promise();
  return (result?.Item ?? null) as RecvTransport | null;
}
