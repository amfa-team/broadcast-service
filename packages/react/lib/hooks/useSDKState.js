import { useEffect, useState } from "react";
import { initialState } from "../sdk/sdk";
export function useSDKState(sdk) {
    const [state, setSDKState] = useState(sdk?.getState() ?? initialState);
    useEffect(() => {
        const listener = () => {
            setSDKState(sdk?.getState() ?? initialState);
        };
        sdk?.addEventListener("state:change", listener);
        listener();
        return () => {
            sdk?.removeEventListener("state:change", listener);
            sdk?.destroy().catch(console.error);
        };
    }, [sdk]);
    return state;
}
//# sourceMappingURL=useSDKState.js.map