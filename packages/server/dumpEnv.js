// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");

const env = [
  `LISTEN_IP=0.0.0.0`,
  `PORT=8080`,
  `CLUSTER_API=${process.env.CLUSTER_API}`,
  `CLUSTER_SECRET=${process.env.CLUSTER_SECRET}`,
  `PUBLIC_IP=${process.env.PUBLIC_IP}`,
];

fs.writeFileSync("./server-env", env.join("\n"), "utf8");
