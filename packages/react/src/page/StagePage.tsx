import { Button, DotLoader } from "@amfa-team/theme-service";
import { useConnect, useToken } from "@amfa-team/user-service";
import React from "react";
import { StageContainer } from "../components/Stage";
import { useSDK } from "../hooks/useSDK";
import type { Settings } from "../types";

interface StagePageProps {
  settings: Settings;
  broadcastEnabled: boolean;
}

export function StagePage(props: StagePageProps) {
  const { settings, broadcastEnabled } = props;
  const token = useToken();
  const state = useSDK(settings);
  const { isConnecting, isReady, connect } = useConnect();

  if (!isReady || isConnecting) {
    return <DotLoader />;
  }

  if (!token) {
    return (
      <div>
        <Button onClick={connect}>Join</Button>
      </div>
    );
  }

  if (!state.loaded) {
    return <DotLoader />;
  }

  return <StageContainer sdk={state.sdk} broadcastEnabled={broadcastEnabled} />;
}
