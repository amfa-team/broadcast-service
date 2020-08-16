import RecvStream from "../sdk/stream/RecvStream";

type UseFollowStream = {
  stream: MediaStream;
};

export default function useFollowStream(stream: RecvStream): UseFollowStream {
  // TODO: Watch streams change (pause, resume...);
  return { stream: stream.getMediaStream() };
}
