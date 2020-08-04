import React from "react";
import { useSDK } from "../src/hooks/useSDK";
import Broadcast from "../src/components/Broadcast";
import Stage from "../src/components/Stage";
import { Switch, Route, Link } from "react-router-dom";

export default function App(): JSX.Element {
  const settings = {
    endpoint: "http://127.0.0.1:3000/dev",
    token: "e2703fbb-c0de-4cf4-b8c9-06e316157347",
  };
  const state = useSDK(settings);

  if (!state.loaded) {
    return <div>Loading...</div>;
  }

  return (
    <Switch>
      <Route path="/broadcast">
        <Broadcast settings={settings} device={state.device} />
      </Route>
      <Route path="/view">
        <Stage settings={settings} device={state.device} />
      </Route>
      <Route>
        <nav>
          <ul>
            <li>
              <Link to="/broadcast">Broadcast</Link>
            </li>
            <li>
              <Link to="/view">View</Link>
            </li>
          </ul>
        </nav>
      </Route>
    </Switch>
  );
}
