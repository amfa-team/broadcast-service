import React, { useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useApi } from "./useApi";

export default function HomePage(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { http: endpoint, secret } = useApi();
  const createHost = useCallback(async () => {
    setLoading(true);

    const res = await fetch(`${endpoint}/dev/admin/participant`, {
      body: JSON.stringify({ role: "host" }),
      headers: {
        "x-api-key": secret,
        "content-type": "application/json",
      },
      method: "POST",
    });
    const data = await res.json();
    history.push(`/broadcast/${data.payload.token}`);
  }, [endpoint, secret, history]);
  const createGuest = useCallback(async () => {
    setLoading(true);

    const res = await fetch(`${endpoint}/dev/admin/participant`, {
      body: JSON.stringify({ role: "guest" }),
      headers: {
        "x-api-key": secret,
        "content-type": "application/json",
      },
      method: "POST",
    });
    const data = await res.json();
    history.push(`/view/${data.payload.token}`);
  }, [endpoint, secret, history]);

  if (loading) {
    return <div>Loading ...</div>;
  }

  return (
    <div>
      <button onClick={createHost}>Create Host</button>
      <button onClick={createGuest}>Create Guest</button>
    </div>
  );
}
