/**
 * This file should be init in the folder of backend of project
 * The name of folder: ./server
 * 
 * To use this config need pm2 package.
 * To start this config use command: pm2 start pm2.config.js
 */

module.exports = {
  apps: [{
    name: 'dashboard',
    cwd: `${process.env.HOME}/dashboard/server`,
    script: `${process.env.HOME}/dashboard/server/server/bin/www`,
    node_args: `--require ${process.env.HOME}/dashboard/server/node_modules/ts-node/register`,
    instances: 1,
    autorestart: true,
    listen_timeout: 5000,
    kill_timeout: 5000,
    watch: false,
    wait_ready: false,
    max_restarts: 10,
    shutdown_with_message: true,
    max_memory_restart: '2G',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    exec_mode: "fork",
    env: {
      NODE_ENV: 'production',
      TS_NODE_PROJECT: `${process.env.HOME}/dashboard/server/tsconfig.json`
    },
    env_staging: {
      NODE_ENV: 'staging',
      TS_NODE_PROJECT: `${process.env.HOME}/dashboard/server/tsconfig.json`
    },
    env_development: {
      NODE_ENV: 'development',
      TS_NODE_PROJECT: `${process.env.HOME}/dashboard/server/tsconfig.json`
    },
    time: true,
    error_file: `${process.env.HOME}/logs/pm2_err.log`,
    out_file: `${process.env.HOME}/logs/pm2_out.log`,
    log_file: `${process.env.HOME}/logs/pm2_combined.log`,
  }, {
    name: 'dashboard-temp',
    cwd: `${process.env.HOME}/dashboard/server`,
    script: `${process.env.HOME}/dashboard/server/server/bin/www`,
    node_args: `--require ${process.env.HOME}/dashboard/server/node_modules/ts-node/register`,
    instances: 1,
    autorestart: true,
    listen_timeout: 5000,
    kill_timeout: 5000,
    watch: false,
    wait_ready: false,
    max_restarts: 10,
    shutdown_with_message: true,
    max_memory_restart: '2G',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    exec_mode: "fork",
    env: {
      NODE_ENV: 'production',
      TS_NODE_PROJECT: `${process.env.HOME}/dashboard/server/tsconfig.json`
    },
    time: true,
    error_file: `${process.env.HOME}/logs/pm2_temp_err.log`,
    out_file: `${process.env.HOME}/logs/pm2_temp_out.log`,
    log_file: `${process.env.HOME}/logs/pm2_temp_combined.log`,
  }]
};
