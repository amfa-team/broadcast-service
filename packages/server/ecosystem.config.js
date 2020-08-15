module.exports = {
  apps: [
    {
      name: "Broadcast Service Server",
      script: "dist/index.js",
      cwd: "packages/server",
      instances: 1,
      autorestart: true,
      wait_ready: true,
      watch: false,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
        PUBLIC_IP: "15.237.3.235",
        LISTEN_IP: "0.0.0.0",
        CLUSTER_API:
          "https://ej1x2iz1g5.execute-api.eu-west-3.amazonaws.com/production",
      },
    },
  ],

  deploy: {
    production: {
      user: "ubuntu",
      host: "15.237.3.235",
      ref: "origin/feature/deployment",
      repo: "git@github.com:amfa-team/picnic-sfu.git",
      path: "/var/www/production",
      "post-deploy":
        "PYTHON=python3 yarn install && yarn server:build && cp ../shared/config/.env packages/server/.env && pm2 reload packages/server/ecosystem.config.js --env production",
    },
  },
};