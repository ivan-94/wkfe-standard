// 宽松版本
// 放宽一些验证规则
// 注意这里只需要把警告规则设置为 warn，不要修改配置
module.exports = {
  extends: [require.resolve('./index.js')],
  rules: {
    'camelcase': 'warn',
    'dot-notation': 'warn',
    'eqeqeq': 'warn',
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
  },
};
