import type {
  Connection,
  ConnectionKey,
  CreateConnection,
  PatchConnection,
} from "@amfa-team/types";
import PicnicError from "../../io/exceptions/PicnicError";
import { ConnectionModel } from "../schema";

export async function createConnection(
  data: CreateConnection,
): Promise<Connection> {
  const connection = new ConnectionModel(data);
  await connection.save();
  return connection.toJSON() as Connection;
}

export async function deleteConnection({
  connectionId,
}: ConnectionKey): Promise<void> {
  await ConnectionModel.delete({ connectionId });
}

export async function getConnection({
  connectionId,
}: ConnectionKey): Promise<Connection | null> {
  const doc = await ConnectionModel.get({ connectionId });
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (doc?.toJSON() ?? null) as Connection | null;
}

export async function getConnectionsByToken({
  token,
}: Pick<Connection, "token">): Promise<Connection[]> {
  // TODO: Add index to use query instead
  // TODO: fix typing
  const results: unknown = await ConnectionModel.scan({
    token: { eq: token },
  }).exec();
  return results as Connection[];
}

export async function getAllConnections(): Promise<Connection[]> {
  const results: unknown = await ConnectionModel.scan().exec();
  return results as Connection[];
}

export async function patchConnection(
  params: PatchConnection,
): Promise<Connection> {
  const { connectionId, ...rest } = params;
  try {
    const doc = await ConnectionModel.update({ connectionId }, rest);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return (doc?.toJSON() ?? null) as Connection;
  } catch (e) {
    throw new PicnicError("patchConnection: fail", e);
  }
}

export async function findConnectionByRecvTransportId(
  recvTransportId: string,
): Promise<Connection[]> {
  try {
    const results: unknown = await ConnectionModel.scan({
      recvTransportId: { eq: recvTransportId },
    }).exec();
    return results as Connection[];
  } catch (e) {
    throw new PicnicError("findConnectionByRecvTransportId: failed", e);
  }
}
