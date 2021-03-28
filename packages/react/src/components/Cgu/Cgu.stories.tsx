import { defaultDictionary } from "@amfa-team/broadcast-service-types";
import React from "react";
import Cgu from "./Cgu";

export default {
  title: "Cgu",
  component: Cgu,
};

export function Default(): JSX.Element | null {
  return <Cgu dictionary={defaultDictionary.fr} />;
}
