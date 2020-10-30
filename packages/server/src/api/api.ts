import { Handlers } from "@sentry/node";
import cors from "cors";
import type { Application, Express } from "express";
import express from "express";
import { authMiddleware } from "../security/security";
import { bindSceneController } from "./controllers/sfuController";

function bind(app: Application): void {
  bindSceneController(app);
}

export async function startApi(): Promise<Express> {
  const app = express();

  app.use(Handlers.requestHandler());

  app.use(cors());
  app.use(express.json());
  app.use(authMiddleware);

  bind(app);

  // The error handler must be before any other error middleware and after all controllers
  app.use(Handlers.errorHandler());

  return new Promise((resolve, reject) => {
    app.listen(Number(process.env.PORT ?? 8080), (err) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log("SFU server started");
        resolve(app);
      }
    });
  });
}
