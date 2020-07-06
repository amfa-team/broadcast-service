import { types } from "mediasoup";

export type Guest = {
  name: string;
};

export type Host = Guest & {
  hosting: true;
};

export type Speaker = {
  who: Host;
  status: "connecting" | "ready" | "active";
  transport: types.WebRtcTransport;
};

// A cohort represent streams broadcasted to a group of guests
// This is used to represent user spread across MediaSoup routers.
export type Cohort = {
  followers: Guest[];
  speakers: Speaker[];
  routerId: string;
};

export type Scene = {
  id: string;
  hosts: { [id: string]: Host };
  guests: { [id: string]: Guest };
  onStage: Host[]; // TODO: allow guests to enter on stage
  cohorts: Cohort[];
};
