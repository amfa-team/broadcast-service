import type {
  ConnectParams,
  DestroyConnectionParams,
  InitConnectionParams,
  ReceiveParams,
  Routes,
  SendDestroyParams,
  SendParams,
} from "@amfa-team/types";
import type { Application } from "express";
import { handleErrorResponse, handleSuccessResponse } from "../../io/io";
import {
  connect,
  destroySend,
  disconnect,
  getRouterCapabilities,
  initConnection,
  pause,
  play,
  receive,
  receiveState,
  send,
  sendPause,
  sendPlay,
  sendState,
} from "../../sfu/sfuService";
import { cleanup, getServerTopology } from "../../sfu/topology";

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

  app.post("/connect/destroy", async (req, res) => {
    try {
      // TODO: validation
      const params: DestroyConnectionParams = req.body;
      const payload = disconnect(params);
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

  app.post("/send/state", async (req, res) => {
    try {
      // TODO: validation
      const request: Routes["/send/state"]["in"] = req.body;
      const payload = await sendState(request);
      handleSuccessResponse(res, payload);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  });

  app.post("/send/pause", async (req, res) => {
    try {
      // TODO: validation
      const { producerId } = req.body;
      const payload = await sendPause(producerId);
      handleSuccessResponse(res, payload);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  });

  app.post("/send/play", async (req, res) => {
    try {
      // TODO: validation
      const { producerId } = req.body;
      const payload = await sendPlay(producerId);
      handleSuccessResponse(res, payload);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  });

  app.post("/send/destroy", async (req, res) => {
    try {
      // TODO: validation
      const request: SendDestroyParams = req.body;
      const payload = await destroySend(request);
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

  app.post("/receive/state", async (req, res) => {
    try {
      // TODO: validation
      const request: Routes["/receive/state"]["in"] = req.body;
      const payload = await receiveState(request);
      handleSuccessResponse(res, payload);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  });

  app.post("/receive/pause", async (req, res) => {
    try {
      // TODO: validation
      const { consumerId } = req.body;
      const payload = await pause(consumerId);
      handleSuccessResponse(res, payload);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  });

  app.post("/receive/play", async (req, res) => {
    try {
      // TODO: validation
      const { consumerId } = req.body;
      const payload = await play(consumerId);
      handleSuccessResponse(res, payload);
    } catch (error) {
      handleErrorResponse(res, error);
    }
  });
}
