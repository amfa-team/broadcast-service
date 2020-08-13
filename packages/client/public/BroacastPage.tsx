import React from "react";
import { Broadcast, useSDK } from "../src";
import { useParams } from "react-router-dom";
import { useApi } from "./useApi";

export default function BroadcastPage(): JSX.Element {
  const { token } = useParams();
  const endpoint = useApi().ws;
  const settings = { endpoint, token };

  const state = useSDK(settings);

  if (!state.loaded) {
    return <div>Loading...</div>;
  }

  return <Broadcast sdk={state.sdk} />;
}
