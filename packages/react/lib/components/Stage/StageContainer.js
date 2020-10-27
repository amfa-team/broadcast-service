import React from "react";
import { Stage } from "./Stage";
import { useStage } from "./useStage";
export function StageContainer(props) {
    const stageProps = useStage(props);
    return React.createElement(Stage, Object.assign({}, stageProps));
}
//# sourceMappingURL=StageContainer.js.map