import { Integrations, captureException, init } from "@sentry/node";
import { config } from "dotenv";
import { startApi } from "./api/api";
import { registerServer } from "./cluster/register";
import { startup } from "./sfu/sfuService";

let timeout: NodeJS.Timeout | null = null;

init({
  dsn:
    "https://2966cca1cb664815bfc242fe7963f630@o443877.ingest.sentry.io/5419724",
  integrations: [
    // enable HTTP calls tracing
    new Integrations.Http({ tracing: true }),
  ],
  environment: process.env.SENTRY_ENVIRONMENT ?? "local",
});

async function startServer(): Promise<void> {
  config();
  await startup();
  await startApi();
  registerServer()
    .then(() => {
      console.log("Registered");
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
  timeout = setInterval(() => {
    registerServer().catch((e) => {
      console.error(e);
      process.exit(1);
    });
  }, 60000);

  process.send?.("ready");
}

function exit(code: 0 | 1) {
  if (timeout) {
    clearInterval(timeout);
  }
  process.exit(code);
}

process.on("unhandledRejection", (error) => {
  captureException(error);
  console.error("unhandledRejection", error);
  exit(1);
});

process.on("uncaughtException", (error) => {
  captureException(error);
  console.error("uncaughtException", error);
  exit(1);
});

// eslint-disable-next-line no-void
void startServer();
