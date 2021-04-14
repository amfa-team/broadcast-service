import { action } from "@storybook/addon-actions";
import type { Story } from "@storybook/react";
import React, { useMemo } from "react";
import audio from "../../../fixtures/assets/outfoxing.mp3";
import video from "../../../fixtures/assets/video.mp4";
import type { RecvStreamState } from "../../../fixtures/RecvStreamFixture";
import { RecvStreamFixture } from "../../../fixtures/RecvStreamFixture";
import { wait } from "../../../fixtures/wait";
import type { RecvStreamVideoProps } from "./RecvStreamVideo";
import { RecvStreamVideo } from ".";

export default {
  title: "Stage/RecvStreamVideo",
  component: RecvStreamVideo,
};

interface TemplateProps extends Omit<RecvStreamVideoProps, "recStream"> {
  state: RecvStreamState;
}

const Template: Story<TemplateProps> = (props: TemplateProps): JSX.Element => {
  const { state, ...rest } = props;
  const recvStream = useMemo(() => {
    return new RecvStreamFixture({ ...state });
  }, [state]);
  return (
    <RecvStreamVideo
      {...rest}
      recvStream={recvStream}
      setFullScreen={async (r) => {
        action("setFullScreen")(r);
        await wait(400);
      }}
    />
  );
};

export const Loading = Template.bind({});
Loading.args = {
  state: {
    isVideoEnabled: false,
    isAudioEnabled: false,
    isAudioPaused: true,
    isVideoPaused: true,
    isReady: false,
    isReconnecting: false,
    audio,
    video,
  },
  isFullScreen: false,
};

export const Default = Template.bind({});
Default.args = {
  state: {
    isVideoEnabled: true,
    isAudioEnabled: true,
    isAudioPaused: false,
    isVideoPaused: false,
    isReady: true,
    isReconnecting: false,
    audio,
    video,
  },
  isFullScreen: true,
};

export const MicOff = Template.bind({});
MicOff.args = {
  state: {
    isVideoEnabled: true,
    isAudioEnabled: false,
    isAudioPaused: false,
    isVideoPaused: false,
    isReady: true,
    isReconnecting: false,
    audio,
    video,
  },
  isFullScreen: true,
};

export const SoundOff = Template.bind({});
SoundOff.args = {
  state: {
    isVideoEnabled: true,
    isAudioEnabled: true,
    isAudioPaused: true,
    isVideoPaused: false,
    isReady: true,
    isReconnecting: false,
    audio,
    video,
  },
  isFullScreen: true,
};

export const NotFullScreen = Template.bind({});
NotFullScreen.args = {
  state: {
    isVideoEnabled: true,
    isAudioEnabled: false,
    isAudioPaused: false,
    isVideoPaused: false,
    isReady: true,
    isReconnecting: false,
    audio,
    video,
  },
  isFullScreen: false,
};

export const IsReconnecting = Template.bind({});
IsReconnecting.args = {
  state: {
    isVideoEnabled: true,
    isAudioEnabled: false,
    isAudioPaused: false,
    isVideoPaused: false,
    isReady: true,
    isReconnecting: true,
    audio,
    video,
  },
  isFullScreen: false,
};
