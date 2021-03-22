import { EventTarget } from "event-target-shim";
import type { IRecvStream, RecvStreamEvents } from "../sdk/stream/RecvStream";

export interface RecvStreamState {
  isAudioPaused: boolean;
  isVideoPaused: boolean;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isReady: boolean;
  isReconnecting: boolean;
  audio: null | string;
  video: null | string;
}

export class RecvStreamFixture
  extends EventTarget<RecvStreamEvents, "strict">
  implements IRecvStream {
  state: RecvStreamState;

  audioEl: HTMLAudioElement | null = null;

  videoEl: HTMLVideoElement | null = null;

  id: string;

  createdAt: number;

  constructor(state: RecvStreamState) {
    super();
    this.state = state;
    this.createdAt = Date.now();
    this.id = String(this.createdAt);
  }

  getId() {
    return this.id;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  autoPlayAudio = () => {
    document.removeEventListener("click", this.autoPlayAudio);

    if (!this.state.isAudioPaused) {
      this.audioEl?.play().catch((e) => {
        if (e.name === "NotAllowedError") {
          document.addEventListener("click", this.autoPlayAudio, false);
        }
      });
    } else {
      this.audioEl?.pause();
    }
  };

  attachAudioEffect(el: HTMLAudioElement | null): () => void {
    if (el === null || this.state.audio === null) {
      return () => {
        // no-op
      };
    }

    this.audioEl = el;
    // eslint-disable-next-line no-param-reassign
    el.src = this.state.audio;
    // eslint-disable-next-line no-param-reassign
    el.onloadedmetadata = this.autoPlayAudio;

    return () => {
      // eslint-disable-next-line no-param-reassign
      el.src = "";
      this.audioEl = null;
      document.removeEventListener("click", this.autoPlayAudio);
    };
  }

  autoPlayVideo = () => {
    document.removeEventListener("click", this.autoPlayVideo);

    if (!this.state.isVideoPaused) {
      this.videoEl?.play().catch((e) => {
        if (e.name === "NotAllowedError") {
          document.addEventListener("click", this.autoPlayVideo, false);
        }
      });
    } else {
      this.videoEl?.pause();
    }
  };

  attachVideoEffect(el: HTMLVideoElement | null): () => void {
    if (el === null || this.state.video === null) {
      return () => {
        // no-op
      };
    }

    this.videoEl = el;

    // eslint-disable-next-line no-param-reassign
    el.src = this.state.video;
    // eslint-disable-next-line no-param-reassign
    el.onloadedmetadata = this.autoPlayVideo;

    return () => {
      // eslint-disable-next-line no-param-reassign
      el.src = "";
      this.videoEl = null;

      document.removeEventListener("click", this.autoPlayVideo);
    };
  }

  isAudioPaused(): boolean {
    return this.state.isAudioPaused;
  }

  isAudioEnabled(): boolean {
    return this.state.isAudioEnabled;
  }

  isVideoPaused(): boolean {
    return this.state.isVideoPaused;
  }

  isVideoEnabled(): boolean {
    return this.state.isVideoEnabled;
  }

  async toggleAudio(): Promise<void> {
    this.state.isAudioPaused = !this.state.isAudioPaused;
    this.autoPlayAudio();
  }

  async toggleVideo(): Promise<void> {
    this.state.isAudioPaused = !this.state.isAudioPaused;
    this.autoPlayVideo();
  }

  isReady(): boolean {
    return this.state.isReady;
  }

  isReconnecting(): boolean {
    return this.state.isReconnecting;
  }
}
