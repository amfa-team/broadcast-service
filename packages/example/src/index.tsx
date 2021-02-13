import { ErrorBoundary } from "@amfa-team/broadcast-service";
import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";
import { init } from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

const generateClassName = createGenerateClassName({
  productionPrefix: "c",
  disableGlobal: true,
});

if (process.env.SENTRY_ENVIRONMENT !== "dev") {
  init({
    dsn: process.env.SENTRY_DNS,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
    environment: process.env.SENTRY_ENVIRONMENT,
  });
}

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <StylesProvider generateClassName={generateClassName}>
          <App />
        </StylesProvider>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root"),
);
