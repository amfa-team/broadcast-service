import React from "react";
import { useSDK } from "../src/hooks/useSDK";
import Broadcast from "../src/components/Broadcast";
import Stage from "../src/components/Stage";
import { Switch, Route, Link } from "react-router-dom";

export default function App(): JSX.Element {
  const settings = {
    endpoint: "http://127.0.0.1:3000/dev",
    token: "a7c020cc-1478-4c9b-9cb6-5fb2c3f01e3b",
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
