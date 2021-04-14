import { requestApi } from "../io/api";
import { getServerToken } from "../security/security";
import { getServerTopology } from "../sfu/topology";
import { getPublicIP } from "./publicIP";

export async function registerServer(): Promise<void> {
  try {
    const topology = await getServerTopology();

    const transports = topology.workers.flatMap(
      (worker) => worker.router.transports,
    );

    const data = {
      ip: getPublicIP(),
      token: getServerToken(),
      port: Number(process.env.PORT ?? 8080),
      transports,
    };

    await requestApi("/admin/server", data);
  } catch (e) {
    console.error("Unable to register, retrying in 10s", e);
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        registerServer().then(resolve).catch(reject);
      }, 10000);
    });
  }
}
