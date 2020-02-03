module.exports = {
  plugins: [
    require('postcss-easy-import')({ prefix: '_' }), // keep it first
    require('autoprefixer'),
    require('postcss-flexbugs-fixes'),
  ],
};
