import { useEffect, useState } from "react";
import { Picnic } from "../sdk/sdk";
export function useSDK(settings) {
    const [state, setSDKState] = useState({ loaded: false });
    const { endpoint, token } = settings;
    const [error, setError] = useState(null);
    useEffect(() => {
        const sdk = new Picnic({ endpoint, token });
        sdk
            .load()
            .then(() => setSDKState({ loaded: true, sdk }))
            // TODO: handle error
            .catch(setError);
        return () => {
            sdk.destroy().catch(console.error);
        };
    }, [endpoint, token]);
    if (error !== null) {
        throw error;
    }
    return state;
}
//# sourceMappingURL=useSDK.js.map