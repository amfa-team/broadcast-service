import React from "react";
import { useSDK, Stage } from "../src";
import { useParams } from "react-router-dom";
import { useApi } from "./useApi";

export default function ViewerPage(): JSX.Element {
  const { token } = useParams();
  const endpoint = useApi().ws;
  const settings = { endpoint, token };

  const state = useSDK(settings);

  if (!state.loaded) {
    return <div>Loading...</div>;
  }

  return <Stage sdk={state.sdk} />;
}
