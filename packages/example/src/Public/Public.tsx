import { SpaceServiceSettings } from "@amfa-team/space-service";
import type { ReactElement } from "react";
import React from "react";
import { Route, Switch } from "react-router-dom";
import BroadcastFeature from "./BroadcastFeature/BroadcastFeature";
import HomeFeature from "./HomeFeature/HomeFeature";
import Menu from "./Menu/Menu";
import { SpaceForm } from "./SpaceForm";
import ViewFeature from "./ViewFeature/ViewFeature";

const endpoint = process.env.SPACE_SERVICE_API_ENDPOINT ?? "";
const settings = { endpoint };

function Public(): ReactElement | null {
  return (
    <SpaceServiceSettings settings={settings}>
      <Menu />
      <Switch>
        <Route path="/" exact>
          <HomeFeature />
        </Route>
        <Route path="/space" exact>
          <SpaceForm />
        </Route>
        <Route path="/space/:spaceId/broadcast">
          <BroadcastFeature />
        </Route>
        <Route path="/space/:spaceId/view">
          <ViewFeature />
        </Route>
      </Switch>
    </SpaceServiceSettings>
  );
}

export default Public;
