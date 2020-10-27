import { ErrorBoundary } from "@amfa-team/picnic-sdk";
import { init } from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";

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
        <App />
      </Router>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root"),
);
