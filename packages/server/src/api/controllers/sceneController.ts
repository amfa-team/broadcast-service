import { Application } from "express";
import {
  getOrCreateScene,
  addHost,
  getCohortCapabilities,
  connectToCohort,
} from "../../scene/sceneService";
import { validateHost } from "../validators/hostValidator";
import { CohortConnectRequest } from "../queries";

export function bindSceneController(app: Application): void {
  app.get("/scene/:sceneId", async (req, res) => {
    try {
      const { sceneId } = req.params;
      const payload = await getOrCreateScene(sceneId);
      res.json({ success: true, payload });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error });
    }
  });

  app.post("/scene/:sceneId/create-host", async (req, res) => {
    try {
      const { sceneId } = req.params;
      const host = validateHost(req.body);
      await addHost(sceneId, host);
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error });
    }
  });

  app.get("/scene/:sceneId/cohort/:routerId/capabilities", async (req, res) => {
    try {
      const { sceneId, routerId } = req.params;
      const payload = await getCohortCapabilities(sceneId, routerId);
      res.json({ success: true, payload });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error });
    }
  });

  app.post("/scene/:sceneId/cohort/:routerId/connect", async (req, res) => {
    try {
      const { sceneId, routerId } = req.params;
      // TODO: CohortConnectRequest validation
      const request: CohortConnectRequest = req.body;
      const payload = await connectToCohort(sceneId, routerId, request);
      res.json({ success: true, payload });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error });
    }
  });
}
