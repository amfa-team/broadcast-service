module.exports = {
  apps: [
    {
      name: "Broadcast Service Server",
      script: "packages/server/dist/index.js",
      instances: 1,
      autorestart: true,
      wait_ready: true,
      watch: false,
      exp_backoff_restart_delay: 100,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      env_staging: {
        NODE_ENV: "production",
      },
    },
  ],

  deploy: {
    production: {
      user: "ubuntu",
      host: "15.237.3.235",
      ref: "origin/master",
      repo: "git@github.com:amfa-team/picnic-sfu.git",
      key: "~/.ssh/picnic",
      ssh_options: ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
      path: "/var/www/production",
      "post-deploy":
        "PYTHON=python3 yarn install && yarn server:build && cp ~/server-env .env && pm2 reload packages/server/ecosystem.config.js --env staging",
    },
    staging: {
      user: "ubuntu",
      host: "15.236.169.203",
      ref: "origin/develop",
      repo: "git@github.com:amfa-team/picnic-sfu.git",
      key: "~/.ssh/picnic",
      ssh_options: ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
      path: "/var/www/staging",
      "post-deploy":
        "PYTHON=python3 yarn install && yarn server:build && cp ~/server-env .env && pm2 reload packages/server/ecosystem.config.js --env staging",
    },
  },
};
