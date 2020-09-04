import React, { useEffect } from "react";
import { useCreateParticipant } from "./useApi";
import { Typography } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
);

interface CreateParticipantPageProps {
  role: "guest" | "host";
}

export default function CreateParticipantPage(
  props: CreateParticipantPageProps
): JSX.Element {
  const classes = useStyles();
  const { loading, createParticipant } = useCreateParticipant();
  const { role } = props;
  useEffect(() => {
    createParticipant(role);
  }, [role, createParticipant]);

  if (loading) {
    return (
      <Backdrop className={classes.backdrop} open>
        <CircularProgress />
      </Backdrop>
    );
  }

  return <Typography>Unexpected Error happen; Please reload</Typography>;
}
