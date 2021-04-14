import type {
  Connection,
  ConnectionKey,
  CreateConnection,
  PatchConnection,
} from "@amfa-team/broadcast-service-types";
import PicnicError from "../../io/exceptions/PicnicError";
import { getModels } from "../../services/mongo/client";

export async function createConnection(
  data: CreateConnection,
): Promise<Connection> {
  const { ConnectionModel } = await getModels();
  const connection = new ConnectionModel(data);
  await connection.save();
  return connection.toJSON() as Connection;
}

export async function deleteConnection({ _id }: ConnectionKey): Promise<void> {
  const { ConnectionModel } = await getModels();
  await ConnectionModel.deleteOne({ _id });
}

export async function getConnection({
  _id,
}: ConnectionKey): Promise<Connection | null> {
  const { ConnectionModel } = await getModels();
  const doc = await ConnectionModel.findById(_id);
  return (doc?.toJSON() ?? null) as Connection | null;
}

export async function getConnectionsByToken({
  token,
}: Pick<Connection, "token">): Promise<Connection[]> {
  const { ConnectionModel } = await getModels();
  const results = await ConnectionModel.find({
    token,
  });
  return results as Connection[];
}

export async function getAllConnections(): Promise<Connection[]> {
  const { ConnectionModel } = await getModels();
  const results: unknown = await ConnectionModel.find();
  return results as Connection[];
}

export async function patchConnection(
  params: PatchConnection,
): Promise<Connection> {
  const { _id, ...rest } = params;
  try {
    const { ConnectionModel } = await getModels();
    await ConnectionModel.updateOne({ _id }, rest);
    const doc = await ConnectionModel.findById(_id);
    return (doc?.toJSON() ?? null) as Connection;
  } catch (e) {
    throw new PicnicError("patchConnection: fail", e);
  }
}

export async function findConnectionByRecvTransportId(
  recvTransportId: string,
): Promise<Connection[]> {
  try {
    const { ConnectionModel } = await getModels();
    const results: unknown = await ConnectionModel.find({
      recvTransportId,
    });
    return results as Connection[];
  } catch (e) {
    throw new PicnicError("findConnectionByRecvTransportId: failed", e);
  }
}

export async function findConnectionBySendTransportId(
  sendTransportId: string,
): Promise<Connection[]> {
  try {
    const { ConnectionModel } = await getModels();
    const results: unknown = await ConnectionModel.find({
      sendTransportId,
    });
    return results as Connection[];
  } catch (e) {
    throw new PicnicError("findConnectionBySendTransportId: failed", e);
  }
}
