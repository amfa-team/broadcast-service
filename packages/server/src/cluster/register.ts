import fetch from "node-fetch";
import { getServerToken } from "../security/security";

function getClusterApi() {
  if (!process.env.CLUSTER_API) {
    throw new Error("Missing CLUSTER_API env-vars");
  }
  if (!process.env.CLUSTER_SECRET) {
    throw new Error("Missing CLUSTER_SECRET env-vars");
  }

  return {
    api: process.env.CLUSTER_API,
    key: process.env.CLUSTER_SECRET,
  };
}

export function getPublicIP(): string {
  if (!process.env.PUBLIC_IP) {
    throw new Error("Missing PUBLIC_IP env-vars");
  }

  return process.env.PUBLIC_IP;
}

export async function registerServer(): Promise<void> {
  const { api, key } = getClusterApi();

  const data = { ip: getPublicIP(), token: getServerToken(), port: 8080 };

  const res = await fetch(`${api}/admin/server`, {
    headers: { "x-api-key": key },
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
  }
  const response = await res.json().catch(() => null);
  if (!res.ok || !response?.success) {
    throw new Error(
      'Failed to register with statusCode "' +
        res.status +
        '" and error ' +
        response?.error
    );
  }
}
