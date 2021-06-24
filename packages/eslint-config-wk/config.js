const parserOptions = {
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    sourceType: 'module',
    requireConfigFile: false,
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
    babelOptions: {
      configFile: false,
      babelrc: false,
      parserOpts: {
        plugins: ['jsx', 'decorators-legacy'],
      },
    },
  },
};

const rules = {
  yoda: 'warn',
  eqeqeq: 'warn',
  camelcase: 'warn',
  'standard/no-callback-literal': 'off',
  'spaced-comment': 'warn',
  'promise/param-names': 'off',
  'prefer-promise-reject-errors': 'warn',
  'prefer-const': 'warn',
  'one-var': 'warn',
  'node/handle-callback-err': 'warn',
  'no-void': ['warn', { allowAsStatement: true }],
  'no-var': 'warn',
  'no-useless-return': 'warn',
  'no-useless-escape': 'warn',
  'no-unused-vars': 'warn',
  'no-unused-expressions': 'warn',
  'no-unneeded-ternary': 'warn',
  'no-shadow': 'error',
  'no-sequences': 'warn',
  'no-return-assign': 'warn',
  'no-prototype-builtins': 'warn',
  'no-new-object': 'warn',
  'no-lone-blocks': 'warn',
  'no-extra-boolean-cast': 'warn',
  'no-empty': ['error', { allowEmptyCatch: true }],
  'no-empty-function': 'warn',
  'no-array-constructor': 'warn',
  'lines-between-class-members': 'warn',
  'import/no-dynamic-require': 'error',
  'import/no-commonjs': 'warn',
  'import/newline-after-import': 'warn',
  'import/first': 'warn',
  'import/extensions': [
    'warn',
    'ignorePackages',
    {
      js: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
      mjs: 'never',
    },
  ],
  // 除了 script，其他都携带扩展名
  'import/no-useless-path-segments': [
    'warn',
    {
      noUselessIndex: true,
    },
  ],
  'handle-callback-err': 'warn',
  'dot-notation': 'warn',
};

exports.createConfig = function createConfig() {
  return {
    extends: ['standard', 'prettier'],
    rules,
    reportUnusedDisableDirectives: true,
    ...parserOptions,
  };
};

exports.parserOptions = parserOptions;
