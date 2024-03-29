module.exports = {
  apps: [{
    name: 'poohitan-com-client',
    script: 'server.js',

    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '300M',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],

  deploy: {
    production: {
      user: 'poohitan',
      host: '46.101.99.203',
      ref: 'origin/master',
      repo: 'git@github.com:poohitan-blog/client.git',
      path: '/home/poohitan/poohitan.com/client',
      'post-deploy': 'npm install --legacy-peer-deps && npm run build && pm2 reload ecosystem.config.js --env production --update-env',
    },
  },
};
