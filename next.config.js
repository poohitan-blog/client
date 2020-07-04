const webpack = require('webpack');

module.exports = {
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
              localsConvention: 'camelCaseOnly',
              modules: {
                ...cssLoader.options.modules,
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
