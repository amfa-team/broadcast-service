import { config } from "dotenv";
import { startApi } from "./api/api";
import { startup } from "./sfu/sfuService";
import { registerServer } from "./cluster/register";

async function startServer(): Promise<void> {
  config();
  await startup();
  await startApi();
  await registerServer();
}

process.on("unhandledRejection", (error) => {
  console.error("unhandledRejection", error);
});

process.on("uncaughtException", (error) => {
  console.error("uncaughtException", error);
});

startServer();
