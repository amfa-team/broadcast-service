import { v4 as uuid } from "uuid";
import type { CreateParticipant, Participant } from "@amfa-team/types";
import { ParticipantModel } from "../schema";

export async function createParticipant(
  params: CreateParticipant,
): Promise<Participant> {
  const participant = {
    ...params,
    token: uuid(),
  };

  const doc = await ParticipantModel.create(participant);
  return doc.toJSON() as Participant;
}

export async function getParticipant(
  token: string,
): Promise<Participant | null> {
  const doc = await ParticipantModel.get(token);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (doc?.toJSON() ?? null) as Participant | null;
}

export async function getAllParticipants(): Promise<Participant[]> {
  const results: unknown = await ParticipantModel.scan().exec();
  return results as Participant[];
}
