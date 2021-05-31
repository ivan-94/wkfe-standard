const rule = require('../src/rules/wxapi');
const { RuleTester } = require('eslint');

const tester = new RuleTester();
tester.run('wxapi', rule, {
  valid: [
    {
      code: `wxApi.previewImage({urls: []});`,
    },
  ],
  invalid: [
    {
      code: `Taro.previewImage({urls: []});`,
      errors: [{ message: '请统一使用 wxApi.* 来使用 Taro API' }],
    },
    {
      code: `my.previewImage({urls: []});`,
      errors: [{ message: '请统一使用 wxApi.* 来使用 Taro API' }],
    },
  ],
});
