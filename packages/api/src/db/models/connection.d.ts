export interface CreateConnection {
  token: string;
  connectionId: string;
}

export interface Connection extends CreateConnection {
  sendTransportId: string | null;
  recvTransportId: string | null;
}

export interface UpdateConnection extends Partial<Connection> {
  connectionId: string; // connectionId is required
}
