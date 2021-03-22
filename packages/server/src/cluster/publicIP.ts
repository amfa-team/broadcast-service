export function getPublicIP(): string {
  if (!process.env.PUBLIC_IP) {
    throw new Error("Missing PUBLIC_IP env-vars");
  }

  return process.env.PUBLIC_IP;
}
