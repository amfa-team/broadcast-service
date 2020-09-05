import React from "react";
import RecvStream from "../../../sdk/stream/RecvStream";
import { useRecvStreamVideo } from "./useRecvStreamVideo";
import { RecvStreamVideo } from "./RecvStreamVideo";
import { Size } from "../StageGrid/layout";

export interface RecvStreamVideoContainerProps {
  recvStream: RecvStream;
  onResize: (size: Size, id: string) => void;
}

function RecvStreamVideoContainerBase(
  props: RecvStreamVideoContainerProps
): JSX.Element {
  const componentProps = useRecvStreamVideo(props);
  return <RecvStreamVideo {...componentProps} />;
}

export const RecvStreamVideoContainer = React.memo(
  RecvStreamVideoContainerBase
);