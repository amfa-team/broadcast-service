import { Loading, StageContainer, useSDK } from "@amfa-team/picnic-sdk";
import React from "react";
import { useParams } from "react-router-dom";
import { useApi } from "./useApi";

export default function BroadcastPage(): JSX.Element {
  const { token } = useParams();
  const endpoint = useApi().ws;
  const settings = { endpoint, token };

  const state = useSDK(settings);

  if (!state.loaded) {
    return <Loading />;
  }

  return <StageContainer sdk={state.sdk} broadcastEnabled />;
}
