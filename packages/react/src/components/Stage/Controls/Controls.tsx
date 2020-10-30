import type { FabProps } from "@material-ui/core";
import { Fab } from "@material-ui/core";
import type { Theme } from "@material-ui/core/styles";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: "absolute",
      bottom: theme.spacing(2),
      right: 0,
      left: 0,
      zIndex: 100,
      textAlign: "center",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  }),
);

export interface ControlElement {
  name: string;
  icon: JSX.Element;
  onClick: () => void;
  color?: FabProps["color"];
}

export interface ControlsProps {
  controls: ControlElement[];
}

export function Controls(props: ControlsProps): JSX.Element {
  const classes = useStyles();

  const { controls } = props;

  return (
    <div className={classes.root}>
      {controls.map(({ name, icon, onClick, color }) => (
        <Fab key={name} onClick={onClick} color={color}>
          {icon}
        </Fab>
      ))}
    </div>
  );
}
