import React from "react";
import { RecvStreamVideoContainer } from "./RecvStreamVideo";
import { StageGrid } from "./StageGrid/StageGrid";
import { UseStage } from "./useStage";
import { SendStreamVideoContainer } from "./SendStreamVideo";
import RecvStream from "../../sdk/stream/RecvStream";
import SendStream from "../../sdk/stream/SendStream";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { SendStreamControls } from "./SendStreamControls";

const useStyles = makeStyles(
  createStyles({
    root: {
      position: "relative",
      height: "100%",
      width: "100%",
    },
  })
);

export function Stage(props: UseStage): JSX.Element {
  const classes = useStyles();
  const { recvStreams, sendStream, onResize, sizes, controls } = props;

  // TODO: Info
  const elements: Array<SendStream | RecvStream> = [...recvStreams];
  if (sendStream !== null) {
    elements.push(sendStream);
  }

  return (
    <div className={classes.root}>
      <StageGrid sizes={sizes}>
        {elements.map((stream) => {
          if (stream instanceof RecvStream) {
            return (
              <RecvStreamVideoContainer
                key={stream.getId()}
                recvStream={stream}
                onResize={onResize}
              />
            );
          } else {
            return (
              <SendStreamVideoContainer
                key={stream.getId()}
                sendStream={stream}
                onResize={onResize}
              />
            );
          }
        })}
      </StageGrid>
      {controls && <SendStreamControls {...controls} />}
    </div>
  );
}
