const config = {
  development: {
    port: 7000,
    clientURL: 'http://localhost:7000',
    apiURL: 'http://localhost:3100',
    cookiesDomain: 'localhost',

    disqus: {
      shortname: 'new-poohitan',
      APIKey: 'yMQUyJ8OWzQhQdUQvU9UT1H2xtvaVbevBScMnaXkhkIauYUKjOoQGLL6usjy7Q3b',
    },
  },

  production: {
    port: 4000,
    clientURL: 'https://poohitan.com',
    apiURL: 'https://api.poohitan.com',
    cookiesDomain: '.poohitan.com',

    disqus: {
      shortname: 'poohitan',
      APIKey: 'yMQUyJ8OWzQhQdUQvU9UT1H2xtvaVbevBScMnaXkhkIauYUKjOoQGLL6usjy7Q3b',
    },

    server: {
      host: '46.101.99.203',
      username: 'poohitan',
      folder: '~/poohitan.com/client',
    },

    git: {
      repo: 'git@github.com:poohitan-blog/client.git',
      branch: 'stable',
    },

    pm2: {
      appName: 'poohitan-com-client',
    },

    googleAnalyticsId: 'UA-10797087',
  },
};

const environment = process.env.NODE_ENV;

module.exports = Object.assign({}, config, {
  current: Object.assign({ environment }, config[environment]),
});
