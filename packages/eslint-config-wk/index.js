const SCRIPT_EXTS = ['js', 'ts', 'tsx', 'jsx', 'mjs'];

module.exports = {
  extends: ['standard', 'prettier', 'prettier/standard'],
  plugins: ['import-path'],
  rules: {
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
    'promise/param-names': 'off',
    // 除了 script，其他都携带扩展名
    'import/no-useless-path-segments': [
      'warn',
      {
        noUselessIndex: true,
      },
    ],
    'import/extensions': [
      'warn',
      'ignorePackages',
      SCRIPT_EXTS.reduce((prv, cur) => {
        prv[cur] = 'never';
        return prv;
      }, {}),
    ],
    // 相对路径不要超过 3层
    'import-path/parent-depth': ['warn', 2],
  },
  reportUnusedDisableDirectives: true,
  parser: 'babel-eslint',
};
