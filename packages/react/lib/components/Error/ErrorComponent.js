import { Box, Typography } from "@material-ui/core";
import React from "react";
export function ErrorComponent() {
    return (React.createElement(Box, null,
        React.createElement(Typography, { variant: "h5", align: "center" }, "Oups! Quelque chose s'est mal passé"),
        React.createElement(Typography, { align: "center" }, "Veuillez recharger la page. Si le problème persiste essayez le support")));
}
//# sourceMappingURL=ErrorComponent.js.map