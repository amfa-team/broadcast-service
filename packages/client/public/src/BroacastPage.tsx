import React, { useState, useCallback } from "react";
import { Broadcast, useSDK, Stage } from "../../src";
import { useParams } from "react-router-dom";
import { useApi } from "./useApi";

export default function BroadcastPage(): JSX.Element {
  const { token } = useParams();
  const endpoint = useApi().ws;
  const settings = { endpoint, token };
  const [stopped, setStopped] = useState(false);

  const state = useSDK(settings);
  const onToggleStop = useCallback(() => {
    setStopped(!stopped);
  }, [stopped]);

  if (!state.loaded) {
    return <div>Loading...</div>;
  }

  if (stopped) {
    return (
      <div>
        Stopped <button onClick={onToggleStop}>Restart</button>
      </div>
    );
  }

  return (
    <div>
      <div>
        <button onClick={onToggleStop}>Stop</button>
      </div>
      <Broadcast sdk={state.sdk} />
      <Stage sdk={state.sdk} />
    </div>
  );
}
