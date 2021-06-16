const { parserOptions } = require('eslint-config-wk/config');

exports.createConfig = function createConfig() {
  return {
    extends: ['react-app', 'prettier'],
    plugins: [],
    rules: {
      'react/jsx-boolean-value': 'warn',
      'react/jsx-curly-brace-presence': 'warn',
    },
    ...parserOptions,
  };
};
