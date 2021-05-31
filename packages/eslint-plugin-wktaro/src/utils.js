/**
 * @param {string} rule
 * @returns
 */
function docsUrl(rule) {
  return 'https://github.com/ivan-94/wkfe-standard/blob/master/packages/eslint-plugin-wktaro/docs/' + rule + '.md';
}

/**
 *
 * @param {string} description
 * @param {string} rule
 * @returns
 */
function buildDocsMeta(description, rule) {
  return {
    description: '[Taro] ' + description,
    category: 'Taro',
    recommended: true,
    url: docsUrl(rule),
  };
}

/**
 * @type {import('eslint').Linter.ParserOptions}
 */
const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
    experimentalObjectRestSpread: true,
  },
};

/**
 * @param {string} code
 * @returns
 */
function testComponent(code) {
  return `
class App extends Component {
  render () {
      ${code}
  }
}
`;
}

/**
 * @param {string} code
 * @returns
 */
function testFunctionComponent(code) {
  return `
const App = (props) => {
  ${code}
}
`;
}

/**
 *
 * @param {string[]} tests
 * @returns
 */
function testValid(tests, raw = false) {
  return tests.map((code) => ({
    code: raw ? code : testComponent(code),
    parser: require.resolve('babel-eslint'),
    parserOptions,
  }));
}

/**
 *
 * @param {string} message
 * @param {string[]} tests
 * @returns
 */
function testInvalid(message, tests, raw = false) {
  return tests.map((code) => ({
    code: raw ? code : testComponent(code),
    errors: [{ message }],
    parser: require.resolve('babel-eslint'),
    parserOptions,
  }));
}

module.exports = {
  buildDocsMeta,
  parserOptions,
  testComponent,
  testFunctionComponent,
  testValid,
  testInvalid,
};
