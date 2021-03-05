import { UserServiceSettings } from "@amfa-team/user-service";
import { CssBaseline } from "@material-ui/core";
import { withProfiler } from "@sentry/react";
import React from "react";
import { Route, Switch } from "react-router-dom";
import Nav from "./Nav/Nav";
import Public from "./Public/Public";
import SettingsPage from "./Public/SettingsPage/SettingsPage";
import Topology from "./Topology";
import User from "./User";

const userEndpoint = process.env.USER_API_ENDPOINT ?? "";

const userSettings = {
  endpoint: userEndpoint,
  secure: process.env.NODE_ENV === "production",
  resetPath: "/",
  invitePath: "/invite",
  getSpacePath: (spaceSlug: string) => `/${spaceSlug}`,
};

function App(): JSX.Element {
  return (
    <UserServiceSettings settings={userSettings}>
      <User />
      <Nav />
      <CssBaseline />
      <Switch>
        <Route path="/admin/topology">
          <Topology />
        </Route>
        <Route path="/settings">
          <SettingsPage />
        </Route>
        <Route path="/">
          <Public />
        </Route>
      </Switch>
    </UserServiceSettings>
  );
}

export default withProfiler(App);
