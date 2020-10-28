import { Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { Loading } from "@amfa-team/picnic-sdk";
import { useCreateParticipant } from "./useApi";

interface CreateParticipantPageProps {
  role: "guest" | "host";
}

export default function CreateParticipantPage(
  props: CreateParticipantPageProps,
): JSX.Element {
  const { loading, createParticipant } = useCreateParticipant();
  const { role } = props;
  useEffect(() => {
    createParticipant(role);
  }, [role, createParticipant]);

  if (loading) {
    return <Loading />;
  }

  return <Typography>Unexpected Error happen; Please reload</Typography>;
}
