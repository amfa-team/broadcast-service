import React from "react";
import { useApi } from "./useApi";
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";

export default function HomePage(): JSX.Element {
  const { secret, setSecret } = useApi();

  return (
    <Container maxWidth="sm">
      <form noValidate autoComplete="off">
        <TextField
          id="outlined-basic"
          label="API SECRET"
          variant="outlined"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
      </form>
    </Container>
  );
}
