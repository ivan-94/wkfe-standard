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
function testValid(tests) {
  return tests.map(code => ({
    code: testComponent(code),
    parser: 'babel-eslint',
  }));
}

/**
 *
 * @param {string} message
 * @param {string[]} tests
 * @returns
 */
function testInvalid(message, tests) {
  return tests.map(code => ({
    code: testComponent(code),
    errors: [{ message }],
    parser: 'babel-eslint',
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
