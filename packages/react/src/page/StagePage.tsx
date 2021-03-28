import type { Dictionary } from "@amfa-team/broadcast-service-types";
import { DotLoader, ErrorShield } from "@amfa-team/theme-service";
import { useToken } from "@amfa-team/user-service";
import { Center } from "@chakra-ui/react";
import React from "react";
import Cgu from "../components/Cgu/Cgu";
import { Stage } from "../components/Stage";
import { useSDK } from "../hooks/useSDK";
import type { Settings } from "../types";

interface StagePageProps {
  settings: Settings;
  broadcastEnabled: boolean;
  dictionary: Dictionary;
}

function RawStagePage(props: StagePageProps) {
  const { settings, broadcastEnabled, dictionary } = props;
  const token = useToken();
  const state = useSDK(settings);

  if (!token) {
    return (
      <Center h="full" w="full">
        <Cgu dictionary={dictionary} />
      </Center>
    );
  }

  if (!state.loaded) {
    return (
      <Center h="full" w="full">
        <DotLoader />
      </Center>
    );
  }

  return <Stage sdk={state.sdk} canBroadcast={broadcastEnabled} />;
}

export function StagePage(props: StagePageProps) {
  return (
    <ErrorShield
      errorTitle={props.dictionary.error.unknown.title}
      errorText={props.dictionary.error.unknown.text}
      errorRetry={props.dictionary.error.unknown.retryBtn}
    >
      <RawStagePage {...props} />
    </ErrorShield>
  );
}

StagePage.defaultProps = {
  broadcastEnabled: false,
};
