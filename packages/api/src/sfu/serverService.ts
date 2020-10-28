import type { RequestInit } from "node-fetch";
import fetch from "node-fetch";
import type { Routes, Server } from "@amfa-team/types";
import { getAllServers } from "../db/repositories/serverRepository";

async function getDestServer(): Promise<Server> {
  const servers = await getAllServers();
  if (servers.length === 0) {
    throw new Error("No registered server");
  }

  return servers[0];
}

export async function requestServer<P extends keyof Routes>(
  path: string,
  options: RequestInit | null = null,
): Promise<Routes[P]["out"]> {
  const server = await getDestServer();

  const res = await fetch(`http://${server.ip}:${server.port}${path}`, {
    ...options,
    headers: {
      ...(options?.headers ?? null),
      "x-api-key": server.token,
    },
  });

  if (!res.ok) {
    const err = await res
      .json()
      .then((body) => body.error as string)
      .catch(() => "Unknown SFU error");
    throw new Error(`requestSFU: fail with ${err}`);
  }

  const body = await res.json();
  if (!body.success) {
    throw new Error(`requestSFU: fail with ${body.error}`);
  }

  return body.payload as Routes[P]["out"];
}

export async function postToServer<P extends keyof Routes>(
  path: P,
  data: Routes[P]["in"],
): Promise<Routes[P]["out"]> {
  const options: RequestInit = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  };

  return requestServer(path, options);
}
