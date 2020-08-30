import fetch from "node-fetch";

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

export async function requestApi<T>(
  path: string,
  data: Record<string, unknown>
): Promise<T> {
  const { api, key } = getClusterApi();

  const res = await fetch(api + path, {
    headers: { "x-api-key": key },
    method: "POST",
    body: JSON.stringify(data),
  });

  const response = await res.json().catch(() => null);
  if (!res.ok || !response?.success) {
    throw new Error(
      'requestApi: failed with "' +
        res.status +
        '" and error ' +
        response?.error
    );
  }

  return response;
}
