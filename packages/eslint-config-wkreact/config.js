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
        jsx: true,
      },
      babelOptions: {
        parserOpts: {
          plugins: ['jsx', ['decorators', { decoratorsBeforeExport: true }]],
        },
      },
    },
  };
};

exports.rules = {};

exports.looseRules = {};
