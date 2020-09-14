import {
  CreateConnection,
  Connection,
  ConnectionKey,
  PatchConnection,
} from "../types/connection";
import { connectionModel } from "../schema";
import { PicnicError } from "../../io/exceptions";

export async function createConnection(
  data: CreateConnection
): Promise<Connection> {
  const connection = new connectionModel(data);
  await connection.save();
  return connection.toJSON() as Connection;
}

export async function deleteConnection({
  connectionId,
}: ConnectionKey): Promise<void> {
  await connectionModel.delete({ connectionId });
}

export async function getConnection({
  connectionId,
}: ConnectionKey): Promise<Connection | null> {
  const doc = await connectionModel.get({ connectionId });
  return (doc?.toJSON() ?? null) as Connection | null;
}

export async function getConnectionsByToken({
  token,
}: Pick<Connection, "token">): Promise<Connection[]> {
  // TODO: Add index to use query instead
  // TODO: fix typing
  const results: unknown = await connectionModel
    .scan({ token: { eq: token } })
    .exec();
  return results as Connection[];
}

export async function getAllConnections(): Promise<Connection[]> {
  const results: unknown = await connectionModel.scan().exec();
  return results as Connection[];
}

export async function patchConnection(
  params: PatchConnection
): Promise<Connection> {
  const { connectionId, ...rest } = params;
  try {
    const doc = await connectionModel.update({ connectionId }, rest);
    return doc.toJSON() as Connection;
  } catch (e) {
    throw new PicnicError("patchConnection: fail", e);
  }
}

export async function findConnectionByRecvTransportId(
  recvTransportId: string
): Promise<Connection[]> {
  try {
    const results: unknown = await connectionModel
      .scan({ recvTransportId: { eq: recvTransportId } })
      .exec();
    return results as Connection[];
  } catch (e) {
    throw new PicnicError("findConnectionByRecvTransportId: failed", e);
  }
}
