module.exports = {
  apps: [
    {
      name: "Broadcast Service Server",
      script: "main.js",
      instances: 1,
      autorestart: true,
      wait_ready: true,
      watch: false,
      exp_backoff_restart_delay: 100,
      env: {
        NODE_ENV: "development",
        SENTRY_ENVIRONMENT: "local",
      },
      env_production: {
        NODE_ENV: "production",
        SENTRY_ENVIRONMENT: "production",
      },
      env_staging: {
        NODE_ENV: "production",
        SENTRY_ENVIRONMENT: "staging",
      },
    },
  ],
};
