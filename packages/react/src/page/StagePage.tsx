import type { Dictionary } from "@amfa-team/broadcast-service-types";
import { DotLoader } from "@amfa-team/theme-service";
import { useToken } from "@amfa-team/user-service";
import { Center } from "@chakra-ui/react";
import React from "react";
import type { ReactElement } from "react";
import Cgu from "../components/Cgu/Cgu";
import { Stage } from "../components/Stage";
import { useSDK } from "../hooks/useSDK";
import type { Settings } from "../types";

interface StagePageProps {
  settings: Settings;
  broadcastEnabled: boolean;
  dictionary: Dictionary;
  helpButton?: ReactElement;
  chatComponent?: ReactElement;
  featuresViewerButton?: any;
  featuresComponents?: any;
  liveDictionary?: any; // Flemme
  onHangUp: () => void;
}

function RawStagePage(props: StagePageProps) {
  const {
    settings,
    broadcastEnabled,
    dictionary,
    helpButton,
    chatComponent,
    featuresViewerButton,
    featuresComponents,
    liveDictionary,
    onHangUp,
  } = props;
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

  return (
    <Stage
      sdk={state.sdk}
      canBroadcast={broadcastEnabled}
      helpButton={helpButton}
      featuresViewerButton={featuresViewerButton}
      chatComponent={chatComponent}
      featuresComponents={featuresComponents}
      onHangUp={onHangUp}
      liveDictionary={liveDictionary}
      dictionary={dictionary}
    />
  );
}
RawStagePage.defaultProps = {
  helpButton: null,
  chatComponent: null,
  featuresViewerButton: [],
  featuresComponents: [],
  liveDictionary: null,
};

export function StagePage(props: StagePageProps) {
  // return (
  //   <ErrorShield
  //     errorTitle={props.dictionary.error.unknown.title}
  //     errorText={props.dictionary.error.unknown.text}
  //     errorRetry={props.dictionary.error.unknown.retryBtn}
  //   >
  //     <RawStagePage {...props} />
  //   </ErrorShield>
  // );
  return <RawStagePage {...props} />;
}

StagePage.defaultProps = {
  broadcastEnabled: false,
  featuresViewerButton: [],
  helpButton: null,
  chatComponent: null,
  featuresComponents: [],
  liveDictionary: null,
};
