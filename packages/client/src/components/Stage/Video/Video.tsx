import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { UseVideo } from "./useVideo";

const useStyles = makeStyles<Theme, { flip: boolean }, string>(
  (theme: Theme) => {
    return createStyles<string, { flip: boolean }>({
      root: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        flex: 1,
      },
      video: {
        width: "100%",
        maxHeight: "100vh",
        borderRadius: "5px",
        transform: (props: { flip: boolean }) =>
          props.flip ? "scaleX(-1)" : "",
        objectFit: "contain",
      },
      hidden: {
        width: "100%",
        borderRadius: "5px",
        position: "absolute",
        visibility: "hidden",
        height: "100%",
        zIndex: -1,
      },
      overlay: {
        position: "absolute",
        borderRadius: "5px",
        zIndex: 20,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        color: theme.palette.info.main,
      },
      children: {
        position: "absolute",
        borderRadius: "5px",
        zIndex: 5,
        width: "100%",
        height: "100%",
      },
    });
  }
);

export interface VideoComponentProps extends UseVideo {
  children?: JSX.Element | null;
}

export function Video(props: VideoComponentProps): JSX.Element | null {
  const { flip, muted, isPlaying, isLoading, refVideo, children } = props;
  const classes = useStyles({ flip });

  return (
    <Box className={classes.root}>
      {!isPlaying && !isLoading && (
        <div className={classes.overlay}>
          <Typography variant="h5">Click to start</Typography>
        </div>
      )}
      {!isLoading && children != null && (
        <div className={classes.children}>{children}</div>
      )}
      {isLoading && <Skeleton variant="rect"></Skeleton>}
      <video
        className={!isLoading ? classes.video : classes.hidden}
        ref={refVideo}
        muted={muted}
      />
    </Box>
  );
}
