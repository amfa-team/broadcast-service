import React, { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";

export function SpaceForm() {
  const history = useHistory();
  const [spaceName, setSpaceName] = useState("");

  const onBroadcast = useCallback(() => {
    history.push(`/space/${spaceName}/broadcast`);
  }, [history, spaceName]);
  const onFollow = useCallback(() => {
    history.push(`/space/${spaceName}/follow`);
  }, [history, spaceName]);
  const onSubmit = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={spaceName}
        onChange={(e) => setSpaceName(e.target.value)}
      />
      <button type="button" onClick={onBroadcast}>
        Broadcast!
      </button>
      <button type="button" onClick={onFollow}>
        Follow!
      </button>
    </form>
  );
}
