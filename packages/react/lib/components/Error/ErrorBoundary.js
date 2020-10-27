import { ErrorBoundary as SentryErrorBoundary } from "@sentry/react";
import React from "react";
import { ErrorComponent } from "./ErrorComponent";
export function ErrorBoundary(props) {
    return (React.createElement(SentryErrorBoundary, { fallback: ErrorComponent }, props.children));
}
//# sourceMappingURL=ErrorBoundary.js.map