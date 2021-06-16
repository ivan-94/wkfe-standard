exports.createConfig = function createConfig(loose = false) {
  return {
    extends: ['wkreact', 'plugin:wktaro/recommended'].concat(
      ['./rules/jsx', './rules/imports', './rules/variables'].map(require.resolve)
    ),
    plugins: [],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/style-prop-object': 'error',
      ...(loose ? exports.looseRules : {}),
    },
  };
};

exports.looseRules = {
  'wktaro/css-module': 'warn',
  'import/no-mutable-exports': 'warn',
};
