import type { Dispatch } from "react";
import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import useLocalStorage from "react-use-localstorage";

export function useApi(): {
  ws: string;
  http: string;
  secret: string;
  setSecret: Dispatch<string>;
  setHttp: Dispatch<string>;
  setWs: Dispatch<string>;
} {
  const [secret, setSecret] = useLocalStorage("API_SECRET", "super-SECRET");
  const [http, setHttp] = useLocalStorage(
    "HTTP_API",
    process.env.HTTP_API
      ? process.env.HTTP_API
      : `http://${window.location.hostname}:4000/dev`,
  );
  const [ws, setWs] = useLocalStorage(
    "WS_API",
    process.env.WS_API
      ? process.env.WS_API
      : `ws://${window.location.hostname}:3001`,
  );

  return {
    ws,
    http,
    secret,
    setSecret,
    setHttp,
    setWs,
  };
}

interface UseCreateHost {
  loading: boolean;
  createHost: () => Promise<string>;
  createGuest: () => Promise<string>;
  createParticipant: (role: "guest" | "host") => Promise<string>;
}

export function useCreateParticipant(): UseCreateHost {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { http: endpoint, secret } = useApi();

  const createParticipant = useCallback(
    async (role: "guest" | "host"): Promise<string> => {
      setLoading(true);

      const res = await fetch(`${endpoint}/admin/participant`, {
        body: JSON.stringify({ role }),
        headers: {
          "x-api-key": secret,
          "content-type": "application/json",
        },
        method: "POST",
      });

      const data = await res.json();

      history.push(
        role === "host"
          ? `/broadcast/${data.payload.token}`
          : `/view/${data.payload.token}`,
      );

      return data.payload.token as string;
    },
    [endpoint, secret, history],
  );

  const createHost = useCallback(async () => createParticipant("host"), [
    createParticipant,
  ]);
  const createGuest = useCallback(async () => createParticipant("guest"), [
    createParticipant,
  ]);

  return { loading, createHost, createParticipant, createGuest };
}
