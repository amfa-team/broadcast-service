import React, { useCallback, useEffect, useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useApi } from "./useApi";

export default function Topology(): JSX.Element {
  const [topology, setTopology] = useState<string | null>(null);
  const [error, setError] = useState<null | Error>(null);

  const { http: endpoint, secret } = useApi();
  const refresh = useCallback(async () => {
    const res = await fetch(`${endpoint}/admin/topology`, {
      headers: {
        "x-api-key": secret,
        "content-type": "application/json",
      },
    });
    setTopology(JSON.stringify(await res.json(), null, 2));
  }, [endpoint, secret]);

  useEffect(() => {
    refresh().catch(setError);
  }, [refresh]);

  if (error) {
    throw error;
  }

  return (
    <div>
      <button type="button" onClick={refresh}>
        Refresh
      </button>
      {topology && (
        <SyntaxHighlighter language="json" style={dracula}>
          {topology}
        </SyntaxHighlighter>
      )}
    </div>
  );
}
