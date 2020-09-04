import React from "react";
import { Switch, Route } from "react-router-dom";
import BroadcastPage from "./BroadcastPage";
import ViewerPage from "./ViewerPage";
import HomePage from "./HomePage";
import Topology from "./Topology";
import { CssBaseline } from "@material-ui/core";
import MenuBar from "./MenuBar";
import CreateParticipantPage from "./CreateParticipantPage";

export default function App(): JSX.Element {
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
            <CreateParticipantPage role="host" />
          </Route>
          <Route path="/admin/create-guest">
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
