import { Loading, StageContainer, useSDK } from "@amfa-team/broadcast-service";
import React from "react";
import { useParams } from "react-router-dom";
import { useApi } from "./useApi";

export default function BroadcastPage(): JSX.Element {
  const { token } = useParams<{ token: string }>();
  const endpoint = useApi().ws;
  const settings = { endpoint, token };

  const state = useSDK(settings);

  if (!state.loaded) {
    return <Loading />;
  }

  return <StageContainer sdk={state.sdk} broadcastEnabled />;
}
