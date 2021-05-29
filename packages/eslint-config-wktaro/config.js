const { looseRules, rules } = require('eslint-config-wkreact/config');
const { looseRules: commonLooseRules, rules: commonRules } = require('eslint-config-wk/config');

exports.createConfig = function createConfig(loose = false) {
  return {
    extends: ['wkreact'],
    plugins: [],
    rules: {
      ...commonRules,
      ...rules,
      'import/prefer-default-export': 'off',
      'import/no-mutable-exports': 'off',
      'react/jsx-no-bind': "warn",
      ...(loose ? commonLooseRules : {}),
      ...(loose ? looseRules : {}),
      ...(loose ? exports.looseRules : {}),
    },
  };
};

exports.looseRules = {
  'import/first': 'warn',
};
