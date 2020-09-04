import { Dispatch, useCallback, useState } from "react";
import useLocalStorage from "react-use-localstorage";
import { useHistory } from "react-router-dom";

export function useApi(): {
  ws: string;
  http: string;
  secret: string;
  setSecret: Dispatch<string>;
} {
  const ws = process.env.WS_API ?? `ws://${window.location.hostname}:3001`;
  const http =
    process.env.HTTP_API ?? `http://${window.location.hostname}:3000/dev`;
  const [secret, setSecret] = useLocalStorage("API_SECRET", "super-SECRET");

  return {
    ws,
    http,
    secret,
    setSecret,
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
          : `/view/${data.payload.token}`
      );

      return data.payload.token;
    },
    [endpoint, secret, history]
  );

  const createHost = useCallback(() => createParticipant("host"), [
    createParticipant,
  ]);
  const createGuest = useCallback(() => createParticipant("guest"), [
    createParticipant,
  ]);

  return { loading, createHost, createParticipant, createGuest };
}
