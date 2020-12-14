const shared = {
  meta: {
    title: 'poohitan',
    description: 'Відвідування цього сайту не рекомендовано Міністерством охорони здоров\'я України.',
    keywords: ['poohitan', 'туфта', 'мандрівки', 'подорожі', 'гори', 'ровер', 'велосипед', 'веб-дизайн', 'програмування', 'JavaScript', 'C++', 'C#', 'бомж', 'трамвай', 'тролейбус', 'місто', 'Львів', 'автостоп', 'фестивалі', 'музика', 'печенько', 'печиво', 'випічка', 'барабани', 'перкусія', 'книжки', 'читання', 'електроніка', 'комп’ютер', 'IT', 'стули пельку', 'рок-н-рол', 'хеві-метал'],
    language: 'uk',
    languageTerritory: 'uk_UA',
    social: {
      twitter: {
        username: '@poohitan',
        link: 'https://twitter.com/poohitan',
      },
      facebook: {
        username: 'poohitan',
        link: 'https://fb.com/poohitan',
      },
    },
  },

  staticRoutes: [
    /^\/rss\/?/,
    /^\/stuff\/[\S]+/,
    /^\/rainbow-sheep/,
    /^\/google/,
    /^\/comic-saaaaaaanns!!/,
    /^\/webcolors/,
    /^\/thats-a-paddlin/,
    /^\/tortynka/,
    /^\/uah/,
    /^\/shutup/,
  ],
};

const config = {
  development: {
    ...shared,
    port: 7000,
    clientURL: 'http://localhost:7000',
    apiURL: 'http://localhost:3100',
    cookiesDomain: 'localhost',

    disqus: {
      shortname: 'poohitan',
    },

    google: {},

    facebook: {},
  },

  production: {
    ...shared,
    port: 4000,
    clientURL: 'https://poohitan.com',
    apiURL: 'https://api.poohitan.com',
    cookiesDomain: '.poohitan.com',

    disqus: {
      shortname: 'poohitan',
    },

    google: {
      analyticsTrackingId: 'UA-10797087-16',
      siteVerificationCode: 'bfS0NjYLa1mTldGwMWMUuG5RuIS1oIksGoVxJoFDZwY',
    },

    facebook: {
      pixel: '323819744625621',
    },
  },
};

const environment = process.env.NODE_ENV;

module.exports = { ...config, current: { environment, ...config[environment] } };
