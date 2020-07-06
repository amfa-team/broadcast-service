import { Guest } from "../../scene/model";

// TODO: use unknown
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateGuest(guest: any): Guest {
  if (typeof guest !== "object" || guest === null) {
    throw new Error("Should be an object");
  }

  if (typeof guest.name !== "string") {
    throw new Error('property "name" should be a string');
  }

  return guest;
}
