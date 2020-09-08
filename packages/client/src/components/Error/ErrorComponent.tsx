import React from "react";
import { Box, Typography } from "@material-ui/core";

export function ErrorComponent(): JSX.Element {
  return (
    <Box>
      <Typography variant="h5" align="center">
        {"Oups! Quelque chose s'est mal passé"}
      </Typography>
      <Typography align="center">
        {
          "Veuillez recharger la page. Si le problème persiste essayez le support"
        }
      </Typography>
    </Box>
  );
}
