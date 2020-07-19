import React from "react";
import { useSDK } from "../hooks/useSDK";
import Ask from "./Ask";
import Broadcast from "./Broadcast";
import Stage from "./Stage";

export function App(): JSX.Element {
  const state = useSDK();

  if (state.loaded) {
    return (
      <>
        <Ask text="Broadcast">
          <Broadcast userId={state.userId} device={state.device} />
        </Ask>
        <Ask text="View">
          <Stage userId={state.userId} device={state.device} />
        </Ask>
      </>
    );
  }

  return <div>Loading...</div>;
}
