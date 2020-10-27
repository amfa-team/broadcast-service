import { Box, CircularProgress } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";

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
  }),
);

export function Loading(): JSX.Element {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <CircularProgress />
    </Box>
  );
}
