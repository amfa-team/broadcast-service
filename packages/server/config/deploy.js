const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const env = [
  `LISTEN_IP=0.0.0.0`,
  `PORT=8080`,
  `CLUSTER_API=${process.env.CLUSTER_API}`,
  `CLUSTER_SECRET=${process.env.CLUSTER_SECRET}`,
  `PUBLIC_IP=${process.env.PUBLIC_IP}`,
  `SENTRY_ENVIRONMENT=${process.env.SENTRY_ENVIRONMENT}`,
];

const sshKey = "~/.ssh/picnic";

console.log("Creating .env file");

fs.writeFileSync(
  path.resolve(__dirname, "..", "dist", ".env"),
  env.join("\n"),
  "utf8",
);

spawnSync(
  "scp",
  [
    "-r",
    "-i",
    sshKey,
    "-o",
    "StrictHostKeyChecking=no",
    "dist",
    `ubuntu@${process.env.PUBLIC_IP}:/var/www/picnic-sfu`,
  ],
  {
    cwd: path.resolve(__dirname, ".."),
    stdio: ["inherit", "inherit", "inherit"],
  },
);

const commands = [
  `cd /var/www/picnic-sfu; PYTHON=python3 yarn install --production`,
  `cd /var/www/picnic-sfu; pm2 startOrReload ecosystem.config.js -u --env ${process.env.SENTRY_ENVIRONMENT}`,
  `pm2 save`,
];

for (let i = 0; i < commands.length; i += 1) {
  const result = spawnSync(
    "ssh",
    [
      "-i",
      sshKey,
      "-o",
      "StrictHostKeyChecking=no",
      `ubuntu@${process.env.PUBLIC_IP}`,
      commands[i],
    ],
    {
      cwd: path.resolve(__dirname, ".."),
      stdio: ["inherit", "inherit", "inherit"],
    },
  );

  if (result.error || result.status || result.stderr) {
    console.error("failed with", result);
    process.exit(1);
  }
}
