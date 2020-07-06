import { Application } from "express";
import {
  getOrCreateScene,
  addHost,
  getCohortCapabilities,
  connectToCohort,
  onConnected,
  produce,
  consume,
} from "../../scene/sceneService";
import { validateHost } from "../validators/hostValidator";
import { CohortConnectRequest } from "../queries";
import { types } from "mediasoup";

export function bindSceneController(app: Application): void {
  app.get("/scene/:sceneId", async (req, res) => {
    try {
      const { sceneId } = req.params;
      const payload = await getOrCreateScene(sceneId);
      res.json({ success: true, payload });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/scene/:sceneId/create-host", async (req, res) => {
    try {
      const { sceneId } = req.params;
      const host = validateHost(req.body);
      const scene = await addHost(sceneId, host);
      res.json({
        success: true,
        payload: { me: host, scene },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/scene/:sceneId/cohort/:routerId/capabilities", async (req, res) => {
    try {
      const { sceneId, routerId } = req.params;
      const payload = await getCohortCapabilities(sceneId, routerId);
      res.json({ success: true, payload });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
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
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post(
    "/scene/:sceneId/cohort/:routerId/connect/:transportId",
    async (req, res) => {
      try {
        const { transportId } = req.params;
        // TODO: validation
        const request: types.DtlsParameters = req.body;
        const payload = await onConnected(transportId, request);
        res.json({ success: true, payload });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
      }
    }
  );

  app.post(
    "/scene/:sceneId/cohort/:routerId/produce/:username/create",
    async (req, res) => {
      try {
        const { sceneId, routerId, username } = req.params;
        // TODO: validation
        const kind: types.MediaKind = req.body.kind;
        const rtpParameters: types.RtpParameters = req.body.rtpParameters;
        const payload = await produce(
          sceneId,
          routerId,
          username,
          kind,
          rtpParameters
        );
        res.json({ success: true, payload });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
      }
    }
  );

  app.post("/consume/:producerId/:transportId/create", async (req, res) => {
    try {
      const { transportId, producerId } = req.params;
      // TODO: validation
      const rtpCapabilities: types.RtpCapabilities = req.body.rtpCapabilities;
      const consumer = await consume(transportId, producerId, rtpCapabilities);
      res.json({
        success: true,
        payload: {
          consumerId: consumer.id,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters,
          type: consumer.type,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
}
