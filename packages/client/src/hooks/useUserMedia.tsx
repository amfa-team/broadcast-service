import { useState, useDebugValue, useEffect } from "react";

type UseUserMedia = {
  stream: null | MediaStream;
  error: null | string;
  state: "pending" | "resolved" | "rejected";
};

export default function useUserMedia(): UseUserMedia {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<null | string>(null);
  const [state, setState] = useState<"pending" | "resolved" | "rejected">(
    "pending"
  );

  useDebugValue({ error, state, stream });

  useEffect(() => {
    let canceled = false;

    setState("pending");

    const constraints = {
      audio: true,
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    };

    navigator.mediaDevices.getUserMedia(constraints).then(
      (stream) => {
        if (!canceled) {
          setState("resolved");
          setStream(stream);
        } else {
          stream.getTracks().forEach((track) => track.stop());
        }
      },
      (error) => {
        if (!canceled) {
          setState("rejected");
          setError(error.toString());
        }
      }
    );

    return (): void => {
      setStream(null);
      setState("pending");
      canceled = true;
    };
  }, []);

  useEffect(
    () => (): void => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    },
    [stream]
  );

  return { error, state, stream };
}
