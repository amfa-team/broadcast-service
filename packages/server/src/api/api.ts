import express, { Application } from "express";
import cors from "cors";
import { bindSceneController } from "./controllers/sceneController";

function bind(app: Application): void {
  bindSceneController(app);
}

export function startApi(): Promise<void> {
  const app = express();
  app.use(cors());
  app.use(express.json());

  bind(app);

  return new Promise((resolve, reject) => {
    app.listen(8080, (err) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log("SFU server started");
        resolve();
      }
    });
  });
}
