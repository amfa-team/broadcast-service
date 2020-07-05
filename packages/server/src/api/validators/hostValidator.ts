import { validateGuest } from "./guestValidator";
import { Host } from "../../scene/model";

// TODO: use unknown
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateHost(host: any): Host {
  validateGuest(host);

  if (!host.hosting) {
    throw new Error('property "hosting" should be a string');
  }

  return host;
}
