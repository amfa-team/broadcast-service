import { Settings } from "../types";

function getAuthHeaders(settings: Settings) {
  return { "x-api-key": settings.token };
}

function getUrl(settings: Settings, path: string): string {
  let sfu = settings.endpoint.endsWith("/") ? "sfu" : "/sfu";

  if (!path.startsWith("/")) {
    sfu += "/";
  }

  return settings.endpoint + sfu + path;
}

export async function get<T>(settings: Settings, path: string): Promise<T> {
  const res = await fetch(getUrl(settings, path), {
    headers: getAuthHeaders(settings),
  });

  if (!res.ok) {
    console.error(res.status);
    throw new Error(`get request failed with status ${res.status}`);
  }

  const response = await res.json();
  if (!response.success) {
    console.error(response.error);
    throw new Error(
      `get request failed with error: ${JSON.stringify(response.error)}`
    );
  }

  return response.payload;
}

export async function post<T>(
  settings: Settings,
  path: string,
  data: Record<string, unknown>
): Promise<T> {
  const res = await fetch(getUrl(settings, path), {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(settings),
    },
  });

  if (!res.ok) {
    console.error(res.status);
    throw new Error(`get request failed with status ${res.status}`);
  }

  const response = await res.json();
  if (!response.success) {
    console.error(response.error);
    throw new Error(
      `get request failed with error: ${JSON.stringify(response.error)}`
    );
  }

  return response.payload;
}
