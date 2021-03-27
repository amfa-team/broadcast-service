import { LiveControls } from "@amfa-team/theme-service";
import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import { useBroadcastControls } from "../../hooks/useBroadcastControls";
import { useRecvControls } from "../../hooks/useRecvControls";
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
  const {
    isTogglingBroadcast,
    isBroadcasting,
    isVideoPaused,
    isAudioPaused,
    isScreenSharing,
    isTogglingVideo,
    isTogglingAudio,
    isTogglingScreenShare,
    onToggleVideo,
    onToggleAudio,
    onToggleScreenShare,
    onToggleBroadcast,
  } = useBroadcastControls(sdk);
  const { setFullScreen } = useRecvControls(sdk);

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
          templateColumns="repeat(3, minmax(0, 33.33%))"
          templateRows="minmax(0, 65%) minmax(0, 35%)"
        >
          {recvStreams.map((recvStream, i) => {
            return (
              <GridItem key={recvStream.getId()} colSpan={i === 0 ? 4 : 1}>
                <RecvStreamVideo
                  recvStream={recvStream}
                  isFullScreen={i === 0}
                  setFullScreen={setFullScreen}
                />
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
        <LiveControls
          startLabel="Start"
          stopLabel="Stop"
          isTogglingBroadcast={isTogglingBroadcast}
          isBroadcasting={isBroadcasting}
          isVideoPaused={isVideoPaused}
          isAudioPaused={isAudioPaused}
          isScreenSharing={isScreenSharing}
          isTogglingVideo={isTogglingVideo}
          isTogglingAudio={isTogglingAudio}
          isTogglingScreenShare={isTogglingScreenShare}
          onToggleVideo={onToggleVideo}
          onToggleAudio={onToggleAudio}
          onToggleScreenShare={onToggleScreenShare}
          onToggleBroadcast={onToggleBroadcast}
        />
      </Grid>
    );
  }

  return (
    <Grid
      w="full"
      h="full"
      templateColumns="repeat(3, minmax(0, 33.33%))"
      templateRows="minmax(0, 65%) minmax(0, 35%)"
      maxW="container.lg"
      margin="auto"
    >
      {recvStreams.map((recvStream, i) => {
        return (
          <GridItem key={recvStream.getId()} colSpan={i === 0 ? 4 : 1}>
            <RecvStreamVideo
              recvStream={recvStream}
              isFullScreen={i === 0}
              setFullScreen={setFullScreen}
            />
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
