module.exports = {
  extends: ['standard', 'prettier', 'prettier/standard'],
  plugins: [],
  rules: {
    'lines-between-class-members': 'warn',
    'spaced-comment': 'warn',
    'no-extra-boolean-cast': 'warn',
    // 使用 let/const 取代 var
    'no-var': 'warn',
    yoda: 'warn',
    'one-var': 'warn',
    'no-empty-function': 'warn',
    // 去除没有必要的转义
    'no-useless-escape': 'warn',
    'prefer-promise-reject-errors': 'warn',
    // 关闭，可以被 prettier 修复
    'no-return-assign': 'warn',
    'standard/no-callback-literal': 'off',
    'promise/param-names': 'off',
  },
  reportUnusedDisableDirectives: true,
};
