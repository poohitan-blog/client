const webpack = require('webpack');
const path = require('path');
const glob = require('glob');

module.exports = {
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
                .map(d => path.join(__dirname, d))
                .map(g => glob.sync(g))
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

    config.plugins.push(jQueryPlugin);

    return config;
  },
};
