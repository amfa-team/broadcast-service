export function useApi(): { ws: string; http: string; secret: string } {
  return {
    ws: `ws://${window.location.hostname}:3001`,
    http: `http://${window.location.hostname}:3000`,
    secret: "super-SECRET",
  };
}
