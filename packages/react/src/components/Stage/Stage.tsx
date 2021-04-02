import { BroadcastControls, LiveControls } from "@amfa-team/theme-service";
import { Box, Flex, Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import type { ReactElement } from "react";
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
  helpButton?: ReactElement;
  featuresViewerButton?: any;
}

function RawStage(props: StageProps): JSX.Element {
  const { sdk, canBroadcast, helpButton, featuresViewerButton } = props;
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
  const chatBar = useDisclosure();

  if (canBroadcast) {
    return (
      <Grid
        column="1"
        templateRows="minmax(0, calc(100% - 80px)) minmax(0, 80px)"
        h="full"
        w="full"
      >
        <Grid
          w="full"
          h="full"
          maxW="container.lg"
          margin="auto"
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
        <BroadcastControls
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
          helpButton={helpButton}
        />
      </Grid>
    );
  }

  return (
    <Grid
      column="1"
      templateRows="minmax(0, calc(100% - 80px)) minmax(0, 80px)"
      h="full"
      w="full"
    >
      <Flex w="full" h="full" bg="#006654">
        <Grid
          w="full"
          h="full"
          templateColumns="repeat(4, minmax(0, 33.33%))"
          templateRows="minmax(0, 65%) minmax(0, 35%)"
          maxW="container.lg"
          margin="auto"
          // ml={{ base: "8", lg: "6", xl: "20" }}
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
          {recvStreams.length < 4 && !sendStream && (
            <>
              {recvStreams.length === 0 && (
                <GridItem
                  colSpan={4}
                  bg="#000000a8"
                  border="1px solid #ffffff70"
                >
                  &nbsp;
                </GridItem>
              )}
              {Array((recvStreams.length === 0 ? 4 : 5) - recvStreams.length)
                .fill(null)
                .map((e, i) => (
                  <GridItem
                    colSpan={1}
                    bg="#000000a8"
                    border="1px solid #ffffff70"
                    key={i}
                  >
                    &nbsp;
                  </GridItem>
                ))}
            </>
          )}
        </Grid>
        {chatBar.isOpen && (
          <AnimatePresence>
            <motion.div
              transition={{ duration: 0.08 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Box w="375px" h="full" bg="white">
                Yo
              </Box>
            </motion.div>
          </AnimatePresence>
        )}
      </Flex>
      <LiveControls
        chatOpenLabel={"Open Chat"}
        chatCloseLabel={"Hide Chat"}
        onHangUp={() => {
          alert("todo");
        }}
        isChatOpen={chatBar.isOpen}
        onChatToggle={chatBar.onToggle}
        helpButton={helpButton}
        featuresButton={featuresViewerButton}
      />
    </Grid>
  );
}

const Stage = React.memo<StageProps>(RawStage);

export { Stage };
