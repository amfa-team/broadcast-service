export interface ConnectionKey {
  connectionId: string;
}

export interface CreateConnection {
  token: string;
  connectionId: string;
}

export interface Connection extends CreateConnection {
  sendTransportId: string | null;
  recvTransportId: string | null;
}

export interface PatchConnection extends Partial<Connection> {
  connectionId: string; // connectionId is required
}
