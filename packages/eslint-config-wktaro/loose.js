// 宽松版本
// 放宽一些验证规则
// 注意这里只需要把警告规则设置为 warn，不要修改配置
module.exports = {
  extends: ['wkreact/loose', require.resolve('./index.js')],
  rules: {},
};
