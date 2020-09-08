import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { Box, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: "100%",
      height: "100%",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  })
);

export function Loading(): JSX.Element {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <CircularProgress />
    </Box>
  );
}
