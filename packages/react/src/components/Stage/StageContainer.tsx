import React from "react";
import { Stage } from "./Stage";
import type { UseStageParams } from "./useStage";
import { useStage } from "./useStage";

export function StageContainer(props: UseStageParams): JSX.Element {
  const stageProps = useStage(props);
  return <Stage {...stageProps} />;
}
