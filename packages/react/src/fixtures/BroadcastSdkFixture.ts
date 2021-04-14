import EventTarget from "event-target-shim";
import { PicnicEvent } from "../sdk/events/event";
import type { IBroadcastSdk, SdkEvents } from "../sdk/sdk";
import type { IRecvStream } from "../sdk/stream/RecvStream";
import type { ISendStream } from "../sdk/stream/SendStream";

export class BroadcastSdkFixture
  extends EventTarget<SdkEvents, "strict">
  implements IBroadcastSdk {
  recvStreams: IRecvStream[] = [];

  broadcastStream: ISendStream | null = null;

  getRecvStreams() {
    return this.recvStreams;
  }

  addRecvStream(s: IRecvStream) {
    this.recvStreams.push(s);
    this.dispatchEvent(new PicnicEvent("stream:update", this.getRecvStreams()));
  }

  getBroadcastStream() {
    return this.broadcastStream;
  }

  setMainRecvStream(id: string | null) {
    const main = this.recvStreams.find((r) => r.getId() === id) ?? null;

    if (main === null) {
      return;
    }

    const rest = this.recvStreams.filter((r) => r.getId() !== id);
    this.recvStreams = [main, ...rest];
    this.dispatchEvent(new PicnicEvent("stream:update", this.getRecvStreams()));
  }

  async broadcast(): Promise<ISendStream> {
    this.broadcastStream = null;
    throw new Error("not supported yet");
  }

  async destroy() {
    this.dispatchEvent(new PicnicEvent("destroy", null));
  }
}
