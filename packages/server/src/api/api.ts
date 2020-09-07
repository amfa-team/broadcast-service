import express, { Express, Application } from "express";
import cors from "cors";
import { bindSceneController } from "./controllers/sfuController";
import { authMiddleware } from "../security/security";
import * as Sentry from "@sentry/node";

function bind(app: Application): void {
  bindSceneController(app);
}

export function startApi(): Promise<Express> {
  const app = express();

  app.use(Sentry.Handlers.requestHandler());

  app.use(cors());
  app.use(express.json());
  app.use(authMiddleware);

  bind(app);

  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());

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
