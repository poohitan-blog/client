const config = {
  development: {
    port: 7000,
    host: 'http://localhost:7000',

    disqus: {
      shortname: 'localhost-z4zziksnph',
    },
  },

  production: {
    port: 7000,
    host: 'https://new.poohitan.com',

    disqus: {
      shortname: 'poohitan',
    },
  },
};

const environment = process.env.NODE_ENV;

export default config[environment];
