import { Box } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
import { RecvStream } from "../../sdk/stream/RecvStream";
import type SendStream from "../../sdk/stream/SendStream";
import { Controls } from "./Controls";
import { RecvStreamVideoContainer } from "./RecvStreamVideo";
import { SendStreamControls } from "./SendStreamControls";
import { SendStreamVideoContainer } from "./SendStreamVideo";
import { StageGrid } from "./StageGrid/StageGrid";
import type { UseStage } from "./useStage";

const useStyles = makeStyles(
  createStyles({
    root: {
      position: "relative",
      height: "100%",
      width: "100%",
    },
    gridWithControls: {
      position: "relative",
      height: "100%",
      width: "100%",
      paddingBottom: "100px",
    },
    gridWithoutControls: {
      position: "relative",
      height: "100%",
      width: "100%",
      paddingBottom: "10px",
    },
  }),
);

export function Stage(props: UseStage): JSX.Element {
  const classes = useStyles();
  const {
    recvStreams,
    sendStream,
    onResize,
    sizes,
    controls,
    extraControls,
    setMain,
    state,
  } = props;

  const elements: Array<SendStream | RecvStream> = [...recvStreams];
  if (sendStream !== null) {
    elements.push(sendStream);
  }

  return (
    <div className={classes.root}>
      <Box
        className={
          controls || extraControls.length > 0
            ? classes.gridWithControls
            : classes.gridWithoutControls
        }
      >
        <StageGrid sizes={sizes}>
          {elements.map((stream, i) => {
            if (stream instanceof RecvStream) {
              return (
                <RecvStreamVideoContainer
                  key={stream.getId()}
                  recvStream={stream}
                  onResize={onResize}
                  isMain={i === 0}
                  setMain={setMain}
                  state={state}
                />
              );
            }
            return (
              <SendStreamVideoContainer
                key={stream.getId()}
                sendStream={stream}
                onResize={onResize}
                state={state}
              />
            );
          })}
        </StageGrid>
      </Box>
      {controls ? (
        <SendStreamControls {...controls} extraControls={extraControls} />
      ) : (
        <Controls controls={extraControls} />
      )}
    </div>
  );
}