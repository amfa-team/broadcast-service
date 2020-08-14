import { config } from "dotenv";
import { startApi } from "./api/api";
import { startup } from "./sfu/sfuService";
import { registerServer } from "./cluster/register";

let timeout: NodeJS.Timeout | null = null;

async function startServer(): Promise<void> {
  config();
  await startup();
  await startApi();
  timeout = setInterval(registerServer, 60000);
}

function exit(code: 0 | 1) {
  if (timeout) {
    clearInterval(timeout);
  }
  process.exit(code);
}

process.on("unhandledRejection", (error) => {
  console.error("unhandledRejection", error);
  exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("uncaughtException", error);
  exit(1);
});

startServer();
