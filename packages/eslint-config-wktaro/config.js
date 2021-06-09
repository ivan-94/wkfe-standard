const { looseRules, rules } = require('eslint-config-wkreact/config');
const { looseRules: commonLooseRules, rules: commonRules } = require('eslint-config-wk/config');

exports.createConfig = function createConfig(loose = false) {
  return {
    extends: ['wkreact', 'plugin:wktaro/recommended'].concat(
      ['./rules/jsx', './rules/imports', './rules/variables'].map(require.resolve)
    ),
    plugins: [],
    rules: {
      ...commonRules,
      ...rules,
      'react/react-in-jsx-scope': 'off',
      'react/style-prop-object': 'error',
      ...(loose ? commonLooseRules : {}),
      ...(loose ? looseRules : {}),
      ...(loose ? exports.looseRules : {}),
    },
  };
};

exports.looseRules = {
  'wktaro/css-module': 'warn',
};
