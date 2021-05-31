const rule = require('../src/rules/redux-connect');
const { testInvalid, testValid } = require('../src/utils');
const { RuleTester } = require('eslint');

const MESSAGE = 'redux connect 必须设置 forwardRef 参数';
const tester = new RuleTester();

tester.run('redux-connect', rule, {
  valid: testValid(['connect(1, 2, 3, {forwardRef: true})'], true),
  invalid: testInvalid(MESSAGE, ['connect()', 'connect(1, 2)', 'connect(1, 2, 3, {})'], true),
});
