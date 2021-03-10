const path = require('path');

module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'jsx-a11y/anchor-is-valid': [1, {
      components: ['Link'],
      specialLink: ['href'],
      aspects: ['noHref', 'invalidHref', 'preferButton'],
    }],
    'import/no-extraneous-dependencies': 0,
    'max-len': [2, {
      code: 120, ignoreStrings: true, ignoreUrls: true, ignoreTemplateLiterals: true,
    }],
    'jsx-a11y/no-static-element-interactions': [1],
    'jsx-a11y/click-events-have-key-events': [1],
    'global-require': [1],
  },
  globals: {
    $: false,
    jQuery: false,
    FormData: false,
    window: false,
    document: false,
    fetch: false,
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: {
          resolve: {
            alias: {
              components: path.resolve(__dirname, 'src/components'),
              helpers: path.resolve(__dirname, 'src/helpers'),
              hocs: path.resolve(__dirname, 'src/hocs'),
              models: path.resolve(__dirname, 'src/models'),
              pages: path.resolve(__dirname, 'src/pages'),
              routes: path.resolve(__dirname, 'src/routes'),
              services: path.resolve(__dirname, 'src/services'),
              styles: path.resolve(__dirname, 'src/styles'),
              utils: path.resolve(__dirname, 'src/utils'),
              config: path.resolve(__dirname, 'config'),
              static: path.resolve(__dirname, 'public/static'),
            },
          },
        },
      },
    },
  },
};
