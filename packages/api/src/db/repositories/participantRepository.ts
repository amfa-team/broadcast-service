import { v4 as uuid } from "uuid";
import { CreateParticipant, Participant } from "../models/participant";
import dynamoDb from "../db";

const TableName = "broadcast-participants";

export async function createParticipant(
  params: CreateParticipant
): Promise<Participant> {
  const participant = {
    ...params,
    token: uuid(),
  };

  await dynamoDb.put({ TableName, Item: participant }).promise();

  return participant;
}

export async function findByToken(token: string): Promise<Participant | null> {
  const result = await dynamoDb.get({ TableName, Key: { token } }).promise();

  return (result?.Item ?? null) as Participant | null;
}

export async function getAllParticipants(): Promise<Participant[]> {
  const scanOutput = await dynamoDb.scan({ TableName }).promise();
  return scanOutput.Items as Participant[];
}
