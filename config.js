const config = {
  development: {
    port: 7000,
    host: 'http://localhost:7000',

    disqus: {
      shortname: 'localhost-z4zziksnph',
    },
  },

  production: {
    port: 4000,
    host: 'https://new.poohitan.com',

    disqus: {
      shortname: 'poohitan',
    },

    server: {
      host: '46.101.99.203',
      username: 'poohitan',
      folder: '~/poohitan.com/client',
    },

    git: {
      repo: 'git@github.com:poohitan-blog/client.git',
      branch: 'production',
    },

    pm2: {
      appName: 'poohitan-com-client',
    },
  },
};

const environment = process.env.NODE_ENV;

module.exports = Object.assign({}, config, { current: Object.assign({ environment }, config[environment]) });
