const rules = require('./rules/index');

module.exports = {
  rules: rules,
  configs: {
    recommended: {
      plugins: ['wktaro'],
      parserOptions: {
        ecmaVersion: 2018,
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        'wktaro/wxapi': 'error',
        'wktaro/css-module': 'error',
      },
    },
  },
};
