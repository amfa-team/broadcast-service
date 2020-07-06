import { types } from "mediasoup-client";
import { Scene, Host } from "../../server/src/scene/model";

export type SceneContext = {
  readonly scene: Scene;
  readonly me: Host | null;
  readonly device: types.Device | null;
  readonly connections: { [routerId: string]: types.Transport };
  readonly producers: { [producerId: string]: types.Producer };
  readonly videoTrack: MediaStreamTrack | null;
};

export function initSceneContext(scene: Scene): SceneContext {
  return {
    scene,
    me: null,
    device: null,
    connections: {},
    producers: {},
    videoTrack: null,
  };
}

export function getDevice(context: SceneContext): types.Device {
  if (!context.device) {
    throw new Error("SceneContext.getDevice: device is not set");
  }

  return context.device;
}

export function getUsername(context: SceneContext): string {
  if (!context.me) {
    throw new Error("SceneContext.getUsername: me is not set");
  }

  return context.me.name;
}
