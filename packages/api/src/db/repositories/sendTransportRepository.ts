import dynamoDb from "../db";
import {
  SendTransportKey,
  SendTransport,
  PatchSendTransport,
} from "../models/sendTransport";

const TableName = process.env.SEND_TRANSPORT_TABLE ?? "";

export async function createSendTransport(
  transport: SendTransport
): Promise<void> {
  await dynamoDb.put({ TableName, Item: transport }).promise();
}

export async function deleteSendTransport({
  transportId,
}: SendTransportKey): Promise<void> {
  await dynamoDb.delete({ TableName, Key: { transportId } }).promise();
}

export async function getSendTransport({
  transportId,
}: SendTransportKey): Promise<SendTransport | null> {
  const result = await dynamoDb
    .get({ TableName, Key: { transportId } })
    .promise();
  return (result?.Item ?? null) as SendTransport | null;
}

export async function patchSendTransport(
  params: PatchSendTransport
): Promise<SendTransport> {
  const previous = await getSendTransport(params);
  if (previous === null) {
    throw new Error(
      "sendTransportRepository.patchSendTransport: transport not found"
    );
  }

  // TODO: Possible edge case where sendTransport is modify between
  const current: SendTransport = {
    ...previous,
    ...params,
  };
  await dynamoDb.put({ TableName, Item: current }).promise();

  return current;
}
