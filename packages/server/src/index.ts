import { config } from "dotenv";
import { startApi } from "./api/api";
import { startup } from "./sfu/sfuService";
import { registerServer } from "./cluster/register";
import * as Sentry from "@sentry/node";

let timeout: NodeJS.Timeout | null = null;

Sentry.init({
  dsn:
    "https://2966cca1cb664815bfc242fe7963f630@o443877.ingest.sentry.io/5419724",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
  ],
  environment: process.env.SENTRY_ENVIRONMENT ?? "local",
});

async function startServer(): Promise<void> {
  config();
  await startup();
  await startApi();
  registerServer().then(() => {
    console.log("Registered");
  });
  timeout = setInterval(registerServer, 60000);

  process.send?.("ready");
}

function exit(code: 0 | 1) {
  if (timeout) {
    clearInterval(timeout);
  }
  process.exit(code);
}

process.on("unhandledRejection", (error) => {
  Sentry.captureException(error);
  console.error("unhandledRejection", error);
  exit(1);
});

process.on("uncaughtException", (error) => {
  Sentry.captureException(error);
  console.error("uncaughtException", error);
  exit(1);
});

startServer();
