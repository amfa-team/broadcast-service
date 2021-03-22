/* eslint-disable @typescript-eslint/no-unsafe-return */
import isEquals from "lodash.isequal";
import React, { useCallback, useEffect, useState } from "react";
import Graph from "react-graph-vis";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { v4 as uuidv4 } from "uuid";
import { useApi } from "./useApi";

const options = {
  layout: {
    hierarchical: false,
  },
  edges: {
    color: "#000000",
  },
  height: "500px",
};

export default function Topology(): JSX.Element {
  const [graph, setGraph] = useState({
    nodes: [],
    edges: [],
  });

  const [events, setEvents] = useState({});
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
    const data = await res.json();
    setTopology(JSON.stringify(data, null, 2));

    const nodes: any = [];
    const edges: any = [];
    setEvents({
      select: (e: any) => {
        console.log(e);
        const selected = nodes
          .filter((n: any) => e.nodes.includes(n.id))
          .map((n: any) => n.title);
        alert(`Selected node: ${selected}`);
      },
    });
    // nodes.push({
    //   id: `server`,
    //   label: `server`,
    //   title: JSON.stringify(data.payload.server, null, 2),
    // });
    data.payload.server.workers.forEach((worker: any) => {
      // edges.push({ from: "server", to: `${worker.pid}` });
      nodes.push({
        id: `${worker.pid}`,
        label: `worker`,
        title: JSON.stringify(worker, null, 2),
      });

      worker.router.transports.forEach((transport: any) => {
        nodes.push({
          id: transport.id,
          label: `transport`,
          title: JSON.stringify(transport, null, 2),
        });
        edges.push({ from: `${worker.pid}`, to: transport.id });

        transport.consumers.forEach((consumer: any) => {
          edges.push({ from: transport.id, to: consumer.id });
          nodes.push({
            id: consumer.id,
            label: `consumer (${consumer.kind})`,
            title: JSON.stringify(consumer, null, 2),
          });
          edges.push({
            from: consumer.producerId,
            to: consumer.id,
          });
        });
        transport.producers.forEach((producer: any) => {
          edges.push({ from: transport.id, to: producer.id });
          nodes.push({
            id: producer.id,
            label: `producer (${producer.kind})`,
            title: JSON.stringify(producer, null, 2),
          });
        });
      });
    });

    setGraph((prev) => {
      const next = { nodes, edges };
      return isEquals(prev, next) ? prev : next;
    });
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
      <Graph
        key={uuidv4()}
        graph={graph}
        options={options}
        events={events}
        // getNetwork={(network) => {
        //   //  if you want access to vis.js network api you can set the state in a parent component using this property
        // }}
      />
      {topology && (
        <SyntaxHighlighter language="json" style={dracula}>
          {topology}
        </SyntaxHighlighter>
      )}
    </div>
  );
}
