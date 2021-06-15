exports.createConfig = function createConfig(loose = false) {
  return {
    extends: ['react-app', 'prettier'],
    plugins: [],
    rules: {
      ...exports.rules,
      ...(loose ? exports.looseRules : {}),
    },
    parser: require.resolve('@babel/eslint-parser'),
    parserOptions: {
      sourceType: 'module',
      requireConfigFile: false,
      ecmaFeatures: {
        modules: true,
        jsx: true,
      },
      babelOptions: {
        parserOpts: {
          plugins: ['jsx', 'decorators-legacy'],
        },
      },
    },
  };
};

exports.rules = {
  'react/jsx-boolean-value': 'warn',
  'react/jsx-curly-brace-presence': 'warn',
};

exports.looseRules = {};
