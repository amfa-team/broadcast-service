import React from "react";
import { Switch, Route } from "react-router-dom";
import BroadcastPage from "./BroacastPage";
import ViewerPage from "./ViewerPage";
import HomePage from "./HomePage";
import Topology from "./Topology";
import CssBaseline from "@material-ui/core/CssBaseline";
import MenuBar from "./MenuBar";
import CreateParticipantPage from "./CreateParticipantPage";

export default function App(): JSX.Element {
  return (
    <>
      <CssBaseline />
      <MenuBar />
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
    </>
  );
}
