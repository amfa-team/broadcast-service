import { CssBaseline } from "@material-ui/core";
import { withProfiler } from "@sentry/react";
import React from "react";
import { Route, Switch } from "react-router-dom";
import BroadcastPage from "./BroadcastPage";
import CreateParticipantPage from "./CreateParticipantPage";
import HomePage from "./HomePage";
import MenuBar from "./MenuBar";
import Topology from "./Topology";
import ViewerPage from "./ViewerPage";

function App(): JSX.Element {
  return (
    <div style={{ position: "absolute", width: "100%", height: "100%" }}>
      <CssBaseline />
      <MenuBar />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "calc(100% - 64px)",
        }}
      >
        <Switch>
          <Route path="/broadcast/:token">
            <BroadcastPage />
          </Route>
          <Route path="/view/:token">
            <ViewerPage />
          </Route>
          <Route path="/admin/topology">
            <Topology />
          </Route>
          <Route path="/admin/create-host">
            {/* eslint-disable-next-line jsx-a11y/aria-role */}
            <CreateParticipantPage role="host" />
          </Route>
          <Route path="/admin/create-guest">
            {/* eslint-disable-next-line jsx-a11y/aria-role */}
            <CreateParticipantPage role="guest" />
          </Route>
          <Route>
            <HomePage />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default withProfiler(App);
