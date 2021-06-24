const { parserOptions } = require('eslint-config-wk/config');

module.exports = {
  extends: ['plugin:vue/recommended', 'prettier'],
  plugins: [],
  rules: {},
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    ...parserOptions,
  },
};
