import { debounce } from "lodash-es";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSDKState } from "../../hooks/useSDKState";
import useSendStreamControls from "./SendStreamControls/useSendStreamControls";
export function useSendStream(sdk, enabled) {
    const [sendStream, setStream] = useState(null);
    const [active, setActive] = useState(false);
    const [error, setError] = useState(null);
    const toggleActive = useCallback(async () => {
        if (sendStream) {
            await sendStream.pauseAudio().catch(setError);
            await sendStream.pauseVideo().catch(setError);
            await sendStream.destroy();
            setStream(null);
        }
        setActive(!active);
    }, [active, sendStream]);
    const controls = useSendStreamControls({ stream: sendStream, toggleActive });
    useEffect(() => {
        // TODO: handle errors like permissions
        let s = null;
        if (enabled && active) {
            sdk
                .broadcast()
                .then((stream) => {
                s = stream;
                setStream(stream);
            })
                .catch(setError);
        }
        return () => {
            s?.destroy().catch(console.error);
        };
    }, [sdk, enabled, active]);
    if (error !== null) {
        throw error;
    }
    return {
        sendStream,
        controls: enabled ? controls : null,
    };
}
export function useRecvStreams(sdk) {
    const [recvStreams, setStreams] = useState({});
    const [main, setMain] = useState(null);
    useEffect(() => {
        const listener = () => {
            setStreams((prevProps) => {
                const prevKeys = Object.keys(prevProps);
                const nextRecvStreams = sdk.getStreams();
                if (prevKeys.length === nextRecvStreams.size &&
                    prevKeys.every((k) => nextRecvStreams.has(k))) {
                    return prevProps;
                }
                const newProps = {};
                sdk.getStreams().forEach((stream, key) => {
                    newProps[key] = stream;
                });
                return newProps;
            });
        };
        sdk.addEventListener("stream:update", listener);
        listener();
        return () => {
            sdk.removeEventListener("stream:update", listener);
        };
    }, [sdk]);
    const orderedRecvStream = useMemo(() => {
        const orderedStreams = Object.values(recvStreams).sort((a, b) => {
            if (a.getId() === main) {
                return -1;
            }
            if (b.getId() === main) {
                return 1;
            }
            return a.getCreatedAt() - b.getCreatedAt();
        });
        return orderedStreams;
    }, [recvStreams, main]);
    return {
        recvStreams: orderedRecvStream,
        setMain,
    };
}
export function useStage({ sdk, extraControls, broadcastEnabled, }) {
    const state = useSDKState(sdk);
    const { sendStream, controls } = useSendStream(sdk, broadcastEnabled);
    const [sizes, setSizes] = useState({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onResize = useCallback(debounce((size, id) => {
        if (size.width === 0 || size.height === 0) {
            return;
        }
        setSizes((prevSize) => {
            if (prevSize[id]?.width === size.width &&
                prevSize[id]?.height === size.height) {
                // If same object is returned, react will skip re-render
                return prevSize;
            }
            return { ...prevSize, [id]: size };
        });
    }, 100), []);
    const { recvStreams, setMain } = useRecvStreams(sdk);
    const sizeArray = recvStreams.map((recvStream) => sizes[recvStream.getId()] ?? { width: 360, height: 180 });
    if (sendStream !== null) {
        sizeArray.push(sizes[sendStream.getId()] ?? { width: 360, height: 180 });
    }
    return {
        recvStreams,
        onResize,
        sizes: sizeArray,
        controls,
        sendStream,
        extraControls: extraControls ?? [],
        setMain,
        state,
    };
}
//# sourceMappingURL=useStage.js.map