import type { Dictionary } from "@amfa-team/broadcast-service-types";
import { Button, DotLoader } from "@amfa-team/theme-service";
import { useConnect, useToken } from "@amfa-team/user-service";
import React from "react";
import { Stage } from "../components/Stage";
import { useSDK } from "../hooks/useSDK";
import type { Settings } from "../types";
import styles from "./stagePage.module.css";

interface StagePageProps {
  settings: Settings;
  broadcastEnabled: boolean;
  dictionary: Dictionary;
}

export function StagePage(props: StagePageProps) {
  const { settings, broadcastEnabled, dictionary } = props;
  const token = useToken();
  const state = useSDK(settings);
  const { isConnecting, isReady, connect } = useConnect();

  if (!isReady || isConnecting) {
    return (
      <div className={styles.container}>
        <DotLoader />
      </div>
    );
  }

  if (!token) {
    return (
      <div className={styles.container}>
        <div className={styles.cgu}>{dictionary.cgu}</div>
        <div className={styles.joinContainer}>
          <Button onClick={connect}>{dictionary.join}</Button>
        </div>
      </div>
    );
  }

  if (!state.loaded) {
    return (
      <div className={styles.container}>
        <DotLoader />
      </div>
    );
  }

  return <Stage sdk={state.sdk} canBroadcast={broadcastEnabled} />;
}

StagePage.defaultProps = {
  broadcastEnabled: false,
};
