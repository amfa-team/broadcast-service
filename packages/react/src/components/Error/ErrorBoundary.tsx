import { ErrorBoundary as SentryErrorBoundary } from "@sentry/react";
import React from "react";
import { ErrorComponent } from "./ErrorComponent";

export interface ErrorBoundaryProps {
  children: JSX.Element;
}

export function ErrorBoundary(props: ErrorBoundaryProps): JSX.Element {
  return (
    <SentryErrorBoundary fallback={ErrorComponent}>
      {props.children}
    </SentryErrorBoundary>
  );
}
