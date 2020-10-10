exports.createConfig = function createConfig(loose = false) {
  return {
    extends: ['standard', 'prettier', 'prettier/standard'],
    plugins: ['import-path'],
    rules: {
      ...exports.rules,
      ...(loose ? exports.looseRules : {}),
    },
    reportUnusedDisableDirectives: true,
    parser: 'babel-eslint',
  };
};

exports.rules = {
  'lines-between-class-members': 'warn',
  'spaced-comment': 'warn',
  // 使用 let/const 取代 var
  'no-var': 'warn',
  yoda: 'warn',
  'one-var': 'warn',
  'no-extra-boolean-cast': 'warn',
  'no-empty-function': 'warn',
  'no-lone-blocks': 'warn',
  // 去除没有必要的转义
  'no-useless-escape': 'warn',
  // 关闭，可以被 prettier 修复
  'no-return-assign': 'warn',
  'no-shadow': 'error',
  'no-empty': ['error', { allowEmptyCatch: true }],
  'prefer-promise-reject-errors': 'warn',
  'standard/no-callback-literal': 'off',
  'no-void': ['warn', { allowAsStatement: true }],
  camelcase: 'warn',
  'promise/param-names': 'off',

  'import/newline-after-import': 'warn',
  'import/first': 'warn',
  // 除了 script，其他都携带扩展名
  'import/no-useless-path-segments': [
    'warn',
    {
      noUselessIndex: true,
    },
  ],
  'import/extensions': ['warn', 'never'],
  // 相对路径不要超过 3层
  'import-path/parent-depth': ['warn', 2],
  'import/no-dynamic-require': 'error',
  'import/no-commonjs': 'warn',
};

exports.looseRules = {
  camelcase: 'warn',
  'dot-notation': 'warn',
  eqeqeq: 'warn',
  'handle-callback-err': 'warn',
  'no-array-constructor': 'warn',
  'no-new-object': 'warn',
  'no-prototype-builtins': 'warn',
  'no-sequences': 'warn',
  'no-shadow': 'warn',
  'no-empty': 'warn',
  'no-unneeded-ternary': 'warn',
  'no-unused-expressions': 'warn',
  'no-unused-vars': 'warn',
  'no-useless-return': 'warn',
  'prefer-const': 'warn',
};
