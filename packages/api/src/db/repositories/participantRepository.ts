import { v4 as uuid } from "uuid";
import { CreateParticipant, Participant } from "../types/participant";
import { participantModel } from "../schema";

export async function createParticipant(
  params: CreateParticipant
): Promise<Participant> {
  const participant = {
    ...params,
    token: uuid(),
  };

  const doc = await participantModel.create(participant);
  return doc.toJSON() as Participant;
}

export async function getParticipant(
  token: string
): Promise<Participant | null> {
  const doc = await participantModel.get(token);
  return (doc?.toJSON() ?? null) as Participant | null;
}

export async function getAllParticipants(): Promise<Participant[]> {
  const results: unknown = await participantModel.scan().exec();
  return results as Participant[];
}