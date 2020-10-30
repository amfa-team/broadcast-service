import { AppBar, Tab, Tabs } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback } from "react";
import { Link, useHistory, useLocation, useRouteMatch } from "react-router-dom";

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
    [history],
  );

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={tabValue} onChange={handleChange} variant="scrollable">
          <Tab
            label={
              <Link style={{ color: "inherit", textDecoration: "none" }} to="/">
                Settings
              </Link>
            }
            value="/"
          />
          <Tab
            label={
              <Link
                style={{ color: "inherit", textDecoration: "none" }}
                to="/admin/create-host"
              >
                Create Host
              </Link>
            }
            value="/admin/create-host"
          />
          <Tab
            label={
              <Link
                style={{ color: "inherit", textDecoration: "none" }}
                to="/admin/create-guest"
              >
                Create Guest
              </Link>
            }
            value="/admin/create-guest"
          />
          <Tab label="Broadcast" value="/broadcast" disabled />
          <Tab label="View" value="/view" disabled />
          <Tab
            label={
              <Link
                style={{ color: "inherit", textDecoration: "none" }}
                to="/admin/topology"
              >
                Topology
              </Link>
            }
            value="/admin/topology"
          />
        </Tabs>
      </AppBar>
    </div>
  );
}
