import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import BroadcastPage from "./BroacastPage";
import ViewerPage from "./ViewerPage";
import HomePage from "./HomePage";

export default function App(): JSX.Element {
  return (
    <Switch>
      <Route path="/broadcast/:token">
        <BroadcastPage />
      </Route>
      <Route path="/view/:token">
        <ViewerPage />
      </Route>
      <Route>
        <HomePage />
      </Route>
    </Switch>
  );
}
