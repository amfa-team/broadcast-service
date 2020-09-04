import React from "react";
import { useStage } from "./useStage";
import { Picnic } from "../../sdk/sdk";
import { Stage } from "./Stage";

export interface StageProps {
  sdk: Picnic;
  broadcastEnabled: boolean;
}

export function StageContainer(props: StageProps): JSX.Element {
  const { sdk, broadcastEnabled } = props;
  const stageProps = useStage(sdk, broadcastEnabled);
  return <Stage {...stageProps} />;
}
