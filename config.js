const config = {
  development: {
    port: 7000,
    clientURL: 'http://localhost:7000',
    apiURL: 'http://localhost:3100',

    disqus: {
      shortname: 'new-poohitan',
      APIKey: 'yMQUyJ8OWzQhQdUQvU9UT1H2xtvaVbevBScMnaXkhkIauYUKjOoQGLL6usjy7Q3b',
    },
  },

  production: {
    port: 4000,
    clientURL: 'https://new.poohitan.com',
    apiURL: 'https://api.poohitan.com',

    disqus: {
      shortname: 'new-poohitan',
      APIKey: 'yMQUyJ8OWzQhQdUQvU9UT1H2xtvaVbevBScMnaXkhkIauYUKjOoQGLL6usjy7Q3b',
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

module.exports = Object.assign({}, config, {
  current: Object.assign({ environment }, config[environment]),
});
