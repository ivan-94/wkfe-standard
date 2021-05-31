const rule = require('../src/rules/css-module');
const { parserOptions } = require('../src/utils');
const { RuleTester } = require('eslint');

const MESSAGE = '请统一使用 CSS Module 进行样式编写';
const tester = new RuleTester();
const options = { parserOptions, parser: require.resolve('babel-eslint') };

tester.run('css-module', rule, {
  valid: [
    {
      code: `import './test.module.scss';`,
      ...options,
    },
    {
      code: `import './test.module.css';`,
      ...options,
    },
    {
      code: `require('./test.module.css');`,
      ...options,
    },
  ],
  invalid: [
    {
      code: `require('./test.css');`,
      errors: [{ message: MESSAGE }],
      ...options,
    },
    {
      code: `import './test.scss';`,
      errors: [{ message: MESSAGE }],
      ...options,
    },
    {
      code: `import './test.css';`,
      errors: [{ message: MESSAGE }],
      ...options,
    },
  ],
});
