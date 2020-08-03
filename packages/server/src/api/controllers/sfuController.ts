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
import { handleSuccessResponse, handleErrorResponse } from "../../io/io";

export function bindSceneController(app: Application): void {
  app.get("/topology", async (req, res) => {
    try {
      const payload = await getServerTopology();
      handleSuccessResponse(res, payload);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  });

  app.get("/cleanup", async (req, res) => {
    try {
      const payload = cleanup();
      handleSuccessResponse(res, payload);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  });

  app.get("/router-capabilities", async (req, res) => {
    try {
      const payload = getRouterCapabilities();
      handleSuccessResponse(res, payload);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  });

  app.post("/connect/init", async (req, res) => {
    try {
      // TODO: InitConnectionParams validation
      const request: InitConnectionParams = req.body;
      const payload = await initConnection(request);
      handleSuccessResponse(res, payload);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  });

  app.post("/connect/create", async (req, res) => {
    try {
      // TODO: validation
      const request: ConnectParams = req.body;
      const payload = await connect(request);
      handleSuccessResponse(res, payload);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  });

  app.post("/send/create", async (req, res) => {
    try {
      // TODO: validation
      const request: SendParams = req.body;
      const payload = await send(request);
      handleSuccessResponse(res, payload);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  });

  app.post("/receive/create", async (req, res) => {
    try {
      // TODO: validation
      const request: ReceiveParams = req.body;
      const payload = await receive(request);
      handleSuccessResponse(res, payload);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  });

  app.post("/receive/play", async (req, res) => {
    try {
      const { consumerId } = req.body;
      const payload = await play(consumerId);
      handleSuccessResponse(res, payload);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  });
}
