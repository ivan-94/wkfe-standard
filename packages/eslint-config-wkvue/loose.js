// 宽松版本
// 放宽一些验证规则
// 注意这里只需要把警告规则设置为 warn，不要修改配置
module.exports = {
  extends: [require.resolve('./index.js')],
  rules: {
    'vue/attributes-order': 'off',
    'vue/no-side-effects-in-computed-properties': 'warn',
    'vue/no-unused-components': 'warn',
    'vue/no-unused-vars': 'warn',
    'vue/order-in-components': 'off',
    'vue/require-valid-default-prop': 'warn',
    'vue/return-in-computed-property': 'warn',
  },
};
