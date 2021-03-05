import type { Theme } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
import ReactResizeDetector from "react-resize-detector";
import type { Layout, Size } from "./layout";
import { getLayout } from "./layout";

const useStyles = makeStyles<Theme, { bbox: Size; layout: Layout }>(
  createStyles({
    root: {
      position: "relative",
      height: ({ bbox }) => `${bbox.height}px`,
      width: ({ bbox }) => `${bbox.width}px`,
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
      flexDirection: ({ layout }) =>
        layout.type === "horizontal" ? "row" : "column",
    },
    main: {
      position: "relative",
      height: ({ layout }) => `${layout.main.height}px`,
      width: ({ layout }) => `${layout.main.width}px`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    rest: {
      position: "relative",
      display: "flex",
      flexDirection: ({ layout }) =>
        layout.type === "horizontal" ? "column" : "row",
      justifyContent: "center",
      alignItems: "center",
      "& > *": {
        position: "relative",
        height: ({ layout }) => `${layout.rest.height - 4}px`,
        width: ({ layout }) => `${layout.rest.width - 4}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "2px",
      },
    },
  }),
);

export interface StageGridProps {
  sizes: Size[];
  children: Array<JSX.Element | null> | JSX.Element[];
}

export interface StageGridFixedProps extends StageGridProps {
  width: number;
  height: number;
}

export function StageGridFixed(props: StageGridFixedProps): JSX.Element | null {
  const { width, height, children, sizes } = props;
  const bbox = { width, height };
  const layout = getLayout(bbox, Object.values(sizes));
  const classes = useStyles({ layout, bbox });

  const [main = null, ...rest] = React.Children.toArray(children);
  const hasRest = rest.length > 0;

  if (main === null) {
    return null;
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.main}>{main}</Box>
      {hasRest && <Box className={classes.rest}>{rest}</Box>}
    </Box>
  );
}

export function StageGrid(props: StageGridProps): JSX.Element | null {
  const { children, sizes } = props;

  if (React.Children.count(children) === 0) {
    return null;
  }

  return (
    <ReactResizeDetector refreshMode="debounce" refreshRate={150}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {({ width = 0, height = 0, targetRef }: any) => {
        return (
          <div
            style={{ width: "100%", height: "100%", position: "relative" }}
            ref={targetRef}
          >
            <StageGridFixed sizes={sizes} width={width} height={height}>
              {children}
            </StageGridFixed>
          </div>
        );
      }}
    </ReactResizeDetector>
  );
}
