import React from "react";
import { useStage, UseStageParams } from "./useStage";
import { Stage } from "./Stage";

export function StageContainer(props: UseStageParams): JSX.Element {
  const stageProps = useStage(props);
  return <Stage {...stageProps} />;
}
