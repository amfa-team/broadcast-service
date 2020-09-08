import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { ErrorBoundary } from "../../src";

Sentry.init({
  dsn:
    "https://4fa79ba1896f420bba7a468048eee137@o443877.ingest.sentry.io/5418207",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  environment: process.env.SENTRY_ENVIRONMENT,
});

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <App />
      </Router>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);
