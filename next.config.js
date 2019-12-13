const webpack = require('webpack');
const path = require('path');
const glob = require('glob');

module.exports = {
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },

  webpack: (config, { dev }) => { // eslint-disable-line
    const rules = [
      {
        test: /\.(css|scss)/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]',
        },
      },
      {
        test: /\.css$/,
        use: ['babel-loader', 'raw-loader', 'postcss-loader'],
      },
      {
        test: /\.s(a|c)ss$/,
        use: ['babel-loader', 'raw-loader', 'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['styles', 'node_modules']
                .map((d) => path.join(__dirname, d))
                .map((g) => glob.sync(g))
                .reduce((a, c) => a.concat(c), []),
            },
          },
        ],
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
};
