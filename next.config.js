const webpack = require('webpack');

module.exports = {
  webpack: (config, { dev }) => { // eslint-disable-line
    const rules = [
      {
        test: /\.svg$/,
        loader: 'raw-loader',
      },
    ];

    config.module.rules.push(...rules);

    // const jQueryPlugin = new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   'window.jQuery': 'jquery',
    // });

    const dateFnsLocalesPlugin = new webpack.ContextReplacementPlugin(
      /date-fns[/\\]/,
      new RegExp(`[/\\\\](${['uk'].join('|')})[/\\\\]`),
    );

    config.plugins.push(dateFnsLocalesPlugin);

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

    return config;
  },
};
