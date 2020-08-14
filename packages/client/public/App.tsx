import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import BroadcastPage from "./BroacastPage";
import ViewerPage from "./ViewerPage";
import HomePage from "./HomePage";
import Topology from "./Topology";

export default function App(): JSX.Element {
  return (
    <>
      <div>
        <nav>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/topology">Topology</Link>
          </li>
        </nav>
      </div>
      <Switch>
        <Route path="/broadcast/:token">
          <BroadcastPage />
        </Route>
        <Route path="/view/:token">
          <ViewerPage />
        </Route>
        <Route path="/topology">
          <Topology />
        </Route>
        <Route>
          <HomePage />
        </Route>
      </Switch>
    </>
  );
}
