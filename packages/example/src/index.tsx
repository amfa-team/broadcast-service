import { ErrorBoundary } from "@amfa-team/broadcast-service";
import { ModalRoot, SbsThemeProvider } from "@amfa-team/theme-service";
import {
  StylesProvider,
  createGenerateClassName,
} from "@material-ui/core/styles";
import { init } from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { RecoilRoot } from "recoil";
import App from "./App";
import "normalize.css/normalize.css";
import "react-datepicker/dist/react-datepicker.css";
import "@amfa-team/theme-service/dist/index.css";
// import "@amfa-team/space-service/dist/index.css";
import "@amfa-team/user-service/dist/index.css";
import "./global.css";

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
        <RecoilRoot>
          <SbsThemeProvider>
            <StylesProvider generateClassName={generateClassName}>
              <Suspense fallback={<div>Loading...</div>}>
                <ModalRoot />
                <App />
              </Suspense>
            </StylesProvider>
          </SbsThemeProvider>
        </RecoilRoot>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root"),
);
