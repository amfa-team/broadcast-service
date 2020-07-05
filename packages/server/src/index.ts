import { startApi } from "./api/api";
import { initWorkers } from "./sfu/workers";

async function startServer(): Promise<void> {
  // TODO: control workers through process.cpus?
  await initWorkers(1);

  await startApi();
}

process.on("unhandledRejection", (error) => {
  console.error("unhandledRejection", error);
});
process.on("uncaughtException", (error) => {
  console.error("uncaughtException", error);
});

startServer();
