import { getServerToken } from "../security/security";
import { requestApi } from "../io/api";

export function getPublicIP(): string {
  if (!process.env.PUBLIC_IP) {
    throw new Error("Missing PUBLIC_IP env-vars");
  }

  return process.env.PUBLIC_IP;
}

export async function registerServer(): Promise<void> {
  const data = {
    ip: getPublicIP(),
    token: getServerToken(),
    port: Number(process.env.PORT ?? 8080),
  };

  try {
    await requestApi("/admin/server", data);
  } catch (e) {
    console.error("Unable to register, retrying in 10s", e);
    await new Promise((resolve, reject) => {
      setTimeout(() => registerServer().then(resolve).catch(reject), 10000);
    });
  }
}
