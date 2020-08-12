import RecvStream from "../sdk/stream/RecvStream";

type UseFollowStream = {
  stream: MediaStream;
};

export default function useFollowStream(stream: RecvStream): UseFollowStream {
  // TODO: Watch streams change
  return { stream: stream.getMediaStream() };
}
