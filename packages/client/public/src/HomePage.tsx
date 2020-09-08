import React from "react";
import { useApi } from "./useApi";
import { TextField, Container } from "@material-ui/core";

export default function HomePage(): JSX.Element {
  const { secret, setSecret, http, setHttp, ws, setWs } = useApi();

  return (
    <Container maxWidth="sm">
      <form noValidate autoComplete="off">
        <TextField
          fullWidth
          id="outlined-basic"
          label="HTTP API"
          variant="outlined"
          margin="normal"
          value={http}
          onChange={(e) => setHttp(e.target.value)}
        />
      </form>
      <form noValidate autoComplete="off">
        <TextField
          fullWidth
          id="outlined-basic"
          label="WS API"
          variant="outlined"
          margin="normal"
          value={ws}
          onChange={(e) => setWs(e.target.value)}
        />
      </form>
      <form noValidate autoComplete="off">
        <TextField
          fullWidth
          id="outlined-basic"
          label="API SECRET"
          variant="outlined"
          value={secret}
          margin="normal"
          onChange={(e) => setSecret(e.target.value)}
        />
      </form>
    </Container>
  );
}
