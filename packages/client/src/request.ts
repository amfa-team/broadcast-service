export async function get<T>(path: string): Promise<T> {
  const res = await fetch(`http://${window.location.hostname}:8080${path}`);

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

export async function post<T>(path: string, data: object): Promise<T> {
  const res = await fetch(`http://localhost:8080${path}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
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
