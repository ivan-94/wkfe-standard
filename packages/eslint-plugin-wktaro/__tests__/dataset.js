const rule = require('../src/rules/dataset');
const { testInvalid, testValid } = require('../src/utils');
const { RuleTester } = require('eslint');

const MESSAGE = '不允许使用 data-set, 该功能不支持跨平台';
const tester = new RuleTester();

tester.run('dataset', rule, {
  valid: testValid([
    'return <div data-scoped="xxx"></div>',
    'return <div data-fixme="xxx"></div>',
    'return <div>hello world</div>',
  ]),
  invalid: testInvalid(MESSAGE, ['return <div data-id="xxx"></div>']),
});
