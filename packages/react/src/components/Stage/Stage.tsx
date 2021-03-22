import { LiveControls } from "@amfa-team/theme-service";
import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import { useBroadcastControls } from "../../hooks/useBroadcastControls";
import { useRecvStreams } from "../../hooks/useRecvStreams";
import { useSendStream } from "../../hooks/useSendStream";
import type { IBroadcastSdk } from "../../sdk/sdk";
import { RecvStreamVideo } from "./RecvStreamVideo";
import { SendStreamVideo } from "./SendStreamVideo";

export interface StageProps {
  sdk: IBroadcastSdk;
  canBroadcast: boolean;
}

function RawStage(props: StageProps): JSX.Element {
  const { sdk, canBroadcast } = props;
  const recvStreams = useRecvStreams(sdk);
  const sendStream = useSendStream(sdk);
  const controls = useBroadcastControls(sdk);

  if (canBroadcast) {
    return (
      <Grid
        column="1"
        templateRows="minmax(0, calc(100% - 80px)) minmax(0, 80px)"
        h="full"
        w="full"
        maxW="container.lg"
        margin="auto"
      >
        <Grid
          w="full"
          h="full"
          templateColumns="repeat(4, minmax(0, 25%))"
          templateRows="minmax(0, 70%) minmax(0, 25%)"
        >
          {recvStreams.map((recvStream, i) => {
            return (
              <GridItem key={recvStream.getId()} colSpan={i === 0 ? 4 : 1}>
                <RecvStreamVideo recvStream={recvStream} />
              </GridItem>
            );
          })}
          {sendStream !== null && (
            <GridItem
              key={sendStream.getId()}
              colSpan={recvStreams.length === 0 ? 4 : 1}
            >
              <SendStreamVideo sendStream={sendStream} />
            </GridItem>
          )}
        </Grid>
        <LiveControls startLabel="Start" stopLabel="Stop" {...controls} />
      </Grid>
    );
  }

  return (
    <Grid
      w="full"
      h="full"
      templateColumns="repeat(4, minmax(0, 25%))"
      templateRows="minmax(0, 70%) minmax(0, 25%)"
      maxW="container.lg"
      margin="auto"
    >
      {recvStreams.map((recvStream, i) => {
        return (
          <GridItem key={recvStream.getId()} colSpan={i === 0 ? 4 : 1}>
            <RecvStreamVideo recvStream={recvStream} />
          </GridItem>
        );
      })}
      {sendStream !== null && (
        <GridItem
          key={sendStream.getId()}
          colSpan={recvStreams.length === 0 ? 4 : 1}
        >
          <SendStreamVideo sendStream={sendStream} />
        </GridItem>
      )}
    </Grid>
  );
}

const Stage = React.memo<StageProps>(RawStage);

export { Stage };
