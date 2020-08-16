import { Dispatch } from "react";
import useLocalStorage from "react-use-localstorage";

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
