import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./nav.module.css";

export default function Nav() {
  return (
    <div className={classes.root}>
      <div>Nav:</div>
      <div className={classes.actions}>
        <div>
          <NavLink to="/space">Space Search</NavLink>
        </div>
        <div>
          <NavLink to="/">Home Feature</NavLink>
        </div>
        <div>
          <NavLink to="/settings">Settings</NavLink>
        </div>
      </div>
    </div>
  );
}
