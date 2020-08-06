import React from "react";
import { useSDK } from "../src/hooks/useSDK";
import Broadcast from "../src/components/Broadcast";
import Stage from "../src/components/Stage";
import { Switch, Route, Link } from "react-router-dom";

export default function App(): JSX.Element {
  const settings = {
    endpoint: "ws://127.0.0.1:3001",
    token: "548b495e-0db6-49a3-86e0-ea496fb29bbb",
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
