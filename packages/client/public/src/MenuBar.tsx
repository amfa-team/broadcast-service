import React, { useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { useLocation, useHistory, useRouteMatch } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    marginBottom: theme.spacing(2),
  },
}));

function useTabValue() {
  const location = useLocation();
  const isBroadcastPage = useRouteMatch("/broadcast/:token");
  const isViewPage = useRouteMatch("/view/:token");

  if (isBroadcastPage) {
    return "/broadcast";
  }
  if (isViewPage) {
    return "/view";
  }

  return location.pathname;
}

export default function MenuBar(): JSX.Element {
  const classes = useStyles();
  const history = useHistory();
  const tabValue = useTabValue();
  const handleChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: string) => {
      history.push(value);
    },
    [history]
  );

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={tabValue} onChange={handleChange} variant="scrollable">
          <Tab label="Settings" value="/" />
          <Tab label="Create Host" value="/admin/create-host" />
          <Tab label="Create Guest" value="/admin/create-guest" />
          <Tab label="Broadcast" value="/broadcast" disabled />
          <Tab label="View" value="/view" disabled />
          <Tab label="Topology" value="/admin/topology" />
        </Tabs>
      </AppBar>
    </div>
  );
}
