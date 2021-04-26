const webpack = require('webpack');
const { current } = require('./config');
const migrationMap = require('./src/helpers/migration-map');

module.exports = {
  // TODO: remove this option as soon as Next.js start using Webpack 5 by default
  future: {
    webpack5: true,
  },

  images: {
    domains: current.imageDomains,
    deviceSizes: [480, 640, 800, 1280, 1600, 1920],
  },

  async rewrites() {
    return [
      {
        source: '/wardrobe',
        destination: '/login',
      },
    ];
  },

  async redirects() {
    const migration = Object.keys(migrationMap).map((source) => ({
      source,
      destination: migrationMap[source],
      permanent: true,
    }));

    return [
      ...migration,
      {
        source: '/trash/index.php',
        destination: '/trash',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/',
        permanent: true,
      },
      {
        source: '/p/:slug/uk',
        destination: '/p/:slug',
        permanent: true,
      },
    ];
  },

  webpack: (config) => {
    // TODO: remove this workaround when this issue is resolved: https://github.com/zeit/next.js/issues/10584
    /* eslint-disable */
    let rule, moduleRules, cssLoader, scssRules, sassLoader;
    if (rule = config.module.rules.find(rule => Object.keys(rule).includes('oneOf'))) {
      if (moduleRules = rule.oneOf.filter(r => ('test.module.scss'.match(r.test) || 'test.module.css'.match(r.test)) && Array.isArray(r.use))) {
        for (const moduleRule of moduleRules) {
          if (cssLoader = moduleRule.use.find(u => u.loader.match('css-loader'))) {
            cssLoader.options = {
              ...cssLoader.options,
              modules: {
                ...cssLoader.options.modules,
                exportLocalsConvention: 'camelCaseOnly',
              },
            };
          }
        }
      }
    }
    /* eslint-enable */

    const rules = [
      {
        test: /\.svg$/,
        use: {
          loader: '@svgr/webpack',
          options: {
            icon: true,
          },
        },
      },
    ];

    const jQueryPlugin = new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    });

    const dateFnsLocalesPlugin = new webpack.ContextReplacementPlugin(
      /date-fns[/\\]/,
      new RegExp(`[/\\\\](${['uk'].join('|')})[/\\\\]`),
    );

    return {
      ...config,

      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          ...rules,
        ],
      },

      plugins: [
        ...config.plugins,
        jQueryPlugin,
        dateFnsLocalesPlugin,
      ],
    };
  },
};
