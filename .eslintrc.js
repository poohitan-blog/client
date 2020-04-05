const alias = require('./alias.config');

module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  rules: {
    'react/jsx-filename-extension': [1, { extensions: [".js", ".jsx"] }],
    'jsx-a11y/anchor-is-valid': [1, {
      components: [ "Link" ],
      specialLink: [ "href" ],
      aspects: [ "noHref", "invalidHref", "preferButton" ]
    }],
    'import/no-extraneous-dependencies': 0,
    'max-len': [2, { code: 120, ignoreStrings: true, ignoreUrls: true, ignoreTemplateLiterals: true }],
    'jsx-a11y/no-static-element-interactions': [1],
    'jsx-a11y/click-events-have-key-events': [1],
    'global-require': [1]
  },
  globals: {
    $: false,
    jQuery: false,
    FormData: false,
    window: false,
    document: false
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: {
          resolve: {
            alias,
          }
        }
      }
    }
  }
}
