import {
  BroadcastControls,
  DotLoader,
  ErrorShield,
  LiveControls,
} from "@amfa-team/theme-service";
import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  useBreakpointValue,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useState } from "react";
import type { ReactElement } from "react";
import { useBroadcastControls } from "../../hooks/useBroadcastControls";
import { useRecvControls } from "../../hooks/useRecvControls";
import { useRecvStreams } from "../../hooks/useRecvStreams";
import { useSDK } from "../../hooks/useSDK";
import { useSendStream } from "../../hooks/useSendStream";
import type { IBroadcastSdk } from "../../sdk/sdk";
import type { Settings } from "../../types";
import { RecvStreamVideo } from "./RecvStreamVideo";
import { SendStreamVideo } from "./SendStreamVideo";

function StreamGrid({ streamLayoutGrid, content, liveDictionary }: any) {
  const [isSmallerThan768] = useMediaQuery(["(max-width: 768px)"]);
  const nbStreams = content.length;

  if (nbStreams === 0) {
    return (
      <GridItem bg="#000000a8" border="1px solid #ffffff70" m="5">
        <Flex
          w="full"
          h="full"
          alignItems="center"
          justifyContent="center"
          color="white"
        >
          {liveDictionary?.noBroadcastYet ?? ""}
        </Flex>
      </GridItem>
    );
  }

  const [mainContent, ...restContent] = content;
  const secLine = [...restContent];
  while (secLine.length < streamLayoutGrid.columns)
    secLine.push({ key: secLine.length + 1, component: "" });

  if (nbStreams > 3 && isSmallerThan768) {
    // FIXEME add infinite
    const subSquare = [secLine.slice(0, 2), secLine.slice(2, 4)];
    return (
      <>
        <GridItem
          bg="#000000a8"
          border="1px solid #ffffff70"
          colSpan={streamLayoutGrid.colSpanFirstLine}
          overflow="hidden"
          key={mainContent.key}
        >
          {mainContent.component}
        </GridItem>
        {subSquare.map((e, i) => (
          <GridItem colSpan={streamLayoutGrid.colSpanSecondLine} key={i}>
            <Grid w="full" h="full" templateRows="repeat(2, minmax(0, 50%))">
              {e.map((e1: any) => (
                <GridItem
                  colSpan={streamLayoutGrid.colSpanSecondLine}
                  bg="#000000a8"
                  border="1px solid #ffffff70"
                  overflow="hidden"
                  key={e1.key}
                >
                  {e1.component}
                </GridItem>
              ))}
            </Grid>
          </GridItem>
        ))}
      </>
    );
  }

  return (
    <>
      <GridItem
        bg="#000000a8"
        border="1px solid #ffffff70"
        colSpan={streamLayoutGrid.columns}
        overflow="hidden"
        key={mainContent.key}
      >
        {mainContent.component}
      </GridItem>
      {secLine.map((e) => (
        <GridItem
          colSpan={streamLayoutGrid.colSpanSecondLine}
          bg="#000000a8"
          border="1px solid #ffffff70"
          key={e.key}
        >
          {e.component}
        </GridItem>
      ))}
    </>
  );
}

export interface BroadcastStageRawProps {
  sdk: IBroadcastSdk;
  helpButton?: ReactElement;
}

function BroadcastStageRaw(props: BroadcastStageRawProps): JSX.Element {
  const { sdk, helpButton } = props;

  const sendStream = useSendStream(sdk);
  const recvStreams = useRecvStreams(sdk);
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

export interface BroadcastStageProps {
  settings: Settings;
  helpButton?: ReactElement;
}
function BroadcastStage(props: BroadcastStageProps): JSX.Element {
  const { settings, ...restProps } = props;

  const state = useSDK(settings);

  if (!state.loaded) {
    return (
      <Center h="full" w="full">
        <DotLoader />
      </Center>
    );
  }

  return <BroadcastStageRaw {...restProps} sdk={state.sdk} />;
}
export interface LiveStageRawProps {
  sdk: IBroadcastSdk;
  liveDictionary?: any; // Flemme
  chatBar?: any; // Flemme
}
function LiveStageRaw(props: LiveStageRawProps): JSX.Element {
  const { sdk, liveDictionary, chatBar } = props;

  const recvStreams = useRecvStreams(sdk);

  const { setFullScreen } = useRecvControls(sdk);

  // @ts-ignore
  const contentStreams = recvStreams.map((recvStream, i) => {
    return {
      key: recvStream.getId(),
      component: (
        <RecvStreamVideo
          recvStream={recvStream}
          isFullScreen={i === 0}
          setFullScreen={setFullScreen}
        />
      ),
    };
  });

  let streamLayoutGrid = {
    templateColumns: {
      base: "unset",
      sm: "unset",
      md: "unset",
      lg: "unset",
    },
    templateRows: {
      base: "unset",
      sm: "unset",
      md: "unset",
      lg: "unset",
    },
    columns: 1,
    colSpanFirstLine: 0,
    colSpanSecondLine: 0,
  };

  switch (contentStreams.length) {
    case 0:
      break;
    case 1:
      streamLayoutGrid = {
        templateColumns: {
          base: "unset",
          sm: "unset",
          md: "unset",
          lg: "unset",
        },
        templateRows: {
          base: "minmax(0, 60%) minmax(0, 0%)",
          sm: "minmax(0, 60%) minmax(0, 0%)",
          md: "minmax(0, 75%) minmax(0, 0%)",
          lg: "minmax(0, 75%) minmax(0, 0%)",
        },
        columns: 1,
        colSpanFirstLine: 1,
        colSpanSecondLine: 1,
      };
      break;
    case 2:
      streamLayoutGrid = {
        templateColumns: {
          base: "100%",
          sm: "100%",
          md: "repeat(2, minmax(0, 50%))",
          lg: "repeat(2, minmax(0, 50%))",
        },
        templateRows: {
          base: "minmax(0, 50%) minmax(0, 50%)",
          sm: "minmax(0, 50%) minmax(0, 50%)",
          md: "minmax(0, 70%) minmax(0, 30%)",
          lg: "minmax(0, 65%) minmax(0, 35%)",
        },
        columns: 2,
        colSpanFirstLine: 2,
        colSpanSecondLine: 1,
      };
      break;
    case 3:
      streamLayoutGrid = {
        templateColumns: {
          base: "repeat(2, minmax(0, 50%))",
          sm: "repeat(2, minmax(0, 50%))",
          md: "repeat(2, minmax(0, 50%))",
          lg: "repeat(2, minmax(0, 50%))",
        },
        templateRows: {
          base: "minmax(0, 50%) minmax(0, 50%)",
          sm: "minmax(0, 50%) minmax(0, 50%)",
          md: "minmax(0, 70%) minmax(0, 30%)",
          lg: "minmax(0, 65%) minmax(0, 35%)",
        },
        columns: 2,
        colSpanFirstLine: 2,
        colSpanSecondLine: 1,
      };
      break;
    default:
      streamLayoutGrid = {
        templateColumns: {
          base: "repeat(2, minmax(0, 50%))",
          sm: "repeat(2, minmax(0, 50%))",
          md: "repeat(4, minmax(0, 25%))",
          lg: "repeat(4, minmax(0, 25%))",
        },
        templateRows: {
          base: "minmax(0, 50%) minmax(0, 50%)",
          sm: "minmax(0, 50%) minmax(0, 50%)",
          md: "minmax(0, 70%) minmax(0, 30%)",
          lg: "minmax(0, 65%) minmax(0, 35%)",
        },
        columns: 4,
        colSpanFirstLine: 2,
        colSpanSecondLine: 1,
      };
      break;
  }

  return (
    <Grid
      w="full"
      h="full"
      templateColumns={streamLayoutGrid.templateColumns}
      templateRows={streamLayoutGrid.templateRows}
      maxW="container.lg"
      margin="auto"
      p={{
        base: contentStreams.length === 0 || chatBar.isOpen ? "0" : "1",
        lg: "0",
      }}
      display={{
        base: chatBar.isOpen ? "none" : "grid",
        lg: "grid",
      }}
    >
      <StreamGrid
        streamLayoutGrid={streamLayoutGrid}
        // @ts-ignore
        content={contentStreams}
        liveDictionary={liveDictionary}
      />
    </Grid>
  );
}
export interface LiveStageProps {
  settings: Settings;
  liveDictionary?: any; // Flemme
  chatBar?: any; // Flemme
}
function LiveStage(props: LiveStageProps): JSX.Element {
  const { settings, ...restProps } = props;

  const state = useSDK(settings);

  if (!state.loaded) {
    return (
      <Center h="full" w="full">
        <DotLoader />
      </Center>
    );
  }

  return <LiveStageRaw {...restProps} sdk={state.sdk} />;
}

export interface StageProps {
  settings: Settings;
  canBroadcast: boolean;
  helpButton?: ReactElement;
  chatComponent?: ReactElement;
  featuresViewerButton?: any;
  featuresComponents?: any;
  onHangUp: () => void;
  dictionary?: any; // Flemme
  liveDictionary?: any; // Flemme
}

function RawStage(props: StageProps): JSX.Element {
  const {
    canBroadcast,
    helpButton,
    featuresViewerButton,
    chatComponent,
    featuresComponents,
    onHangUp,
    dictionary,
    liveDictionary,
    settings,
  } = props;

  const chatBar = useDisclosure();
  const featureBar = useDisclosure();
  const detectLgBreakpoint = useBreakpointValue({ base: false, lg: true });
  const [selectedFeature, setSelectedFeature] = useState(-1);

  const onChatToggle = useCallback(() => {
    if (!detectLgBreakpoint && featureBar.isOpen && !chatBar.isOpen) {
      featureBar.onClose();
    }
    chatBar.onToggle();
  }, [detectLgBreakpoint, featureBar, chatBar]);

  const onFeatureToggle = useCallback(
    (i) => {
      if (!detectLgBreakpoint && chatBar.isOpen && !featureBar.isOpen) {
        chatBar.onClose();
      }
      featureBar.onToggle();
      setSelectedFeature(i);
    },
    [detectLgBreakpoint, featureBar, chatBar],
  );

  if (canBroadcast) {
    return <BroadcastStage helpButton={helpButton} settings={settings} />;
  }

  return (
    <Grid
      column="1"
      templateRows="minmax(0, calc(100% - 80px)) minmax(0, 80px)"
      h="full"
      w="full"
    >
      <Flex w="full" h="full" bg="#006654">
        <ErrorShield
          errorTitle={dictionary.error.unknown.title}
          errorText={dictionary.error.unknown.text}
          errorRetry={dictionary.error.unknown.retryBtn}
          notSupportedErrorTitle={dictionary.error.notSupported.title}
          notSupportedErrorText={dictionary.error.notSupported.text}
          notSupportedErrorRetry={dictionary.error.notSupported.retryBtn}
        >
          <LiveStage
            settings={settings}
            liveDictionary={liveDictionary}
            chatBar={chatBar}
          />
        </ErrorShield>
        {chatBar.isOpen && (
          <AnimatePresence>
            <motion.div
              transition={{ duration: 0.08 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, zIndex: 1 }}
              exit={{ opacity: 0 }}
            >
              <Flex w={{ base: "100vw", lg: "375px" }} h="full" bg="white">
                {chatComponent}
              </Flex>
            </motion.div>
          </AnimatePresence>
        )}
        {featureBar.isOpen && (
          <AnimatePresence>
            <motion.div
              transition={{ duration: 0.08 }}
              initial={{
                opacity: 1,
                position: "absolute",
                height: "0",
                width: "100vw",
                bottom: "80px",
                pointerEvents: "none",
              }}
              animate={{ zIndex: 10, height: "85vh" }}
              exit={{ opacity: 0 }}
            >
              <Flex
                w={{
                  base: "full",
                  lg: chatBar.isOpen ? "calc(100% - 375px)" : "full",
                }}
                h="full"
                alignItems="flex-end"
                justifyContent="center"
              >
                <Box
                  bg="gray.900"
                  h="auto"
                  w="full"
                  maxW="container.lg"
                  color="white"
                  pointerEvents="all"
                >
                  {featuresComponents.map((feature: any, i: any) => {
                    return (
                      <Box
                        key={i}
                        display={selectedFeature === i ? "block" : "none"}
                        w="full"
                        h="full"
                      >
                        {feature}
                      </Box>
                    );
                  })}
                </Box>
              </Flex>
            </motion.div>
          </AnimatePresence>
        )}
      </Flex>
      <LiveControls
        chatOpenLabel={liveDictionary.chatOpenLabel}
        chatCloseLabel={liveDictionary.chatCloseLabel}
        hangUpLabel={liveDictionary.hangUpLabel}
        onHangUp={onHangUp}
        isChatOpen={chatBar.isOpen}
        onChatToggle={onChatToggle}
        helpButton={helpButton}
        featuresButton={featuresViewerButton}
        isFeatureOpen={featureBar.isOpen}
        onFeatureToggle={(i: any) => onFeatureToggle(i)}
      />
    </Grid>
  );
}

const Stage = React.memo<StageProps>(RawStage);

export { Stage };

// // @ts-ignore
// const contentStreams = [
//   {
//     component: (
//       <Flex
//         w="full"
//         h="full"
//         alignItems="center"
//         justifyContent="center"
//         color="white"
//       >
//         screenshare
//       </Flex>
//     ),
//     key: 1,
//   },
//   {
//     component: (
//       <Flex
//         w="full"
//         h="full"
//         alignItems="center"
//         justifyContent="center"
//         color="white"
//         bg="tomato"
//       >
//         camera1
//       </Flex>
//     ),
//     key: 2,
//   },
//   // {
//   //   component: (
//   //     <Flex
//   //       w="full"
//   //       h="full"
//   //       alignItems="center"
//   //       justifyContent="center"
//   //       color="white"
//   //     >
//   //       cam2
//   //     </Flex>
//   //   ),
//   //   key: 3,
//   // },
//   // {
//   //   component: (
//   //     <Flex
//   //       w="full"
//   //       h="full"
//   //       alignItems="center"
//   //       justifyContent="center"
//   //       color="white"
//   //     >
//   //       cam4
//   //     </Flex>
//   //   ),
//   //   key: 4,
//   // },
//   // {
//   //   component: (
//   //     <Flex
//   //       w="full"
//   //       h="full"
//   //       alignItems="center"
//   //       justifyContent="center"
//   //       color="white"
//   //     >
//   //       cam3
//   //     </Flex>
//   //   ),
//   //   key: 5,
//   // },
// ];
