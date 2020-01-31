const webpack = require('webpack');
const path = require('path');
const shorthash = require('shorthash');
const withSass = require('@zeit/next-sass');

const CSS_MODULES_EXCLUDE_PATHS = ['node_modules', 'global'];

module.exports = withSass({
  cssModules: true,
  cssLoaderOptions: {
    camelCase: true,
    getLocalIdent: (loaderContext, localIdentName, localName) => {
      const { resourcePath } = loaderContext;

      if (CSS_MODULES_EXCLUDE_PATHS.some((pathToExclude) => resourcePath.includes(pathToExclude))) {
        return localName;
      }

      const fileName = path.basename(loaderContext.resourcePath);
      const name = fileName.replace(/\.[^/.]+$/, '');
      const hash = shorthash.unique(loaderContext.resourcePath);

      return `${name}-${localName}--${hash}`;
    },
  },

  webpack: (config, { dev }) => { // eslint-disable-line
    const rules = [
      {
        test: /\.css$/,
        use: ['babel-loader', 'raw-loader'],
      },
      {
        test: /\.svg$/,
        loader: 'raw-loader',
      },
    ];

    config.module.rules.push(...rules);

    const jQueryPlugin = new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    });

    const dateFnsLocalesPlugin = new webpack.ContextReplacementPlugin(
      /date-fns[/\\]/,
      new RegExp(`[/\\\\](${['uk'].join('|')})[/\\\\]`),
    );

    config.plugins.push(jQueryPlugin, dateFnsLocalesPlugin);

    return config;
  },
});
