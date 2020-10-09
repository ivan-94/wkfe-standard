// 宽松版本
// 放宽一些验证规则
// 覆盖默认规则
const { createConfig } = require('./config');

module.exports = createConfig(true);
