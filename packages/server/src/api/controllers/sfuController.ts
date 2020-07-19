import { Application } from "express";
import {
  InitConnectionParams,
  ConnectParams,
  SendParams,
  ReceiveParams,
} from "../../sfu/types";
import {
  getRouterCapabilities,
  initConnection,
  connect,
  send,
  receive,
  play,
} from "../../sfu/sfuService";
import { getServerTopology, cleanup } from "../../sfu/topology";

export function bindSceneController(app: Application): void {
  app.get("/topology", async (req, res) => {
    try {
      const payload = await getServerTopology();
      res.json({ success: true, payload });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/cleanup", async (req, res) => {
    try {
      const payload = cleanup();
      res.json({ success: true, payload });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/router-capabilities", async (req, res) => {
    try {
      const payload = getRouterCapabilities();
      res.json({ success: true, payload });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/connect/init", async (req, res) => {
    try {
      // TODO: InitConnectionParams validation
      const request: InitConnectionParams = req.body;
      const payload = await initConnection(request);
      res.json({ success: true, payload });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/connect/create", async (req, res) => {
    try {
      // TODO: validation
      const request: ConnectParams = req.body;
      const payload = await connect(request);
      res.json({ success: true, payload });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/send/create", async (req, res) => {
    try {
      // TODO: validation
      const request: SendParams = req.body;
      const payload = await send(request);
      res.json({ success: true, payload });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/receive/create", async (req, res) => {
    try {
      // TODO: validation
      const request: ReceiveParams = req.body;
      const payload = await receive(request);
      res.json({ success: true, payload });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/receive/:consumerId/play", async (req, res) => {
    try {
      const { consumerId } = req.params;
      const payload = await play(consumerId);
      res.json({ success: true, payload });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
}
