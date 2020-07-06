import { Scene, Host } from "../../server/src/scene/model";
import { get, post } from "./request";

export async function createScene(name: string): Promise<Scene> {
  return get<Scene>(`/scene/${name}`);
}

export async function createHost(
  sceneId: string,
  name: string
): Promise<Scene> {
  const host: Host = {
    hosting: true,
    name,
  };
  return post<Scene>(`/scene/${name}/create-host`, host);
}
