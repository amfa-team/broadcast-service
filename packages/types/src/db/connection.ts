export interface ConnectionKey {
  _id: string;
}

export interface CreateConnection extends ConnectionKey {
  token: string;
}

export interface Connection extends CreateConnection {
  sendTransportId: string | null;
  recvTransportId: string | null;
}

export interface PatchConnection extends Partial<Connection> {
  _id: string; // connectionId is required
}
