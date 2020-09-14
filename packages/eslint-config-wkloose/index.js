module.exports = {
  // 放宽一些验证规则
  // 注意这里只需要把警告规则设置为 warn，不要修改配置
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

    // 放宽 vue 的相关规则
    'vue/attributes-order': 'off',
    'vue/no-side-effects-in-computed-properties': 'warn',
    'vue/no-unused-components': 'warn',
    'vue/no-unused-vars': 'warn',
    'vue/order-in-components': 'off',
    'vue/require-valid-default-prop': 'warn',
    'vue/return-in-computed-property': 'warn',
  },
};
