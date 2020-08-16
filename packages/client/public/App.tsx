import React from "react";
import { useSDK } from "../src/hooks/useSDK";
import Broadcast from "../src/components/Broadcast";
import Stage from "../src/components/Stage";
import { Switch, Route, Link } from "react-router-dom";

export default function App(): JSX.Element {
  const settings = {
    endpoint: `ws://${window.location.hostname}:3001`,
    token: "25ec36e1-8143-49db-9bb0-b828156b41a6",
  };
  const state = useSDK(settings);

  if (!state.loaded) {
    return <div>Loading...</div>;
  }

  return (
    <Switch>
      <Route path="/broadcast">
        <Broadcast sdk={state.sdk} />
      </Route>
      <Route path="/view">
        <Stage sdk={state.sdk} />
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
