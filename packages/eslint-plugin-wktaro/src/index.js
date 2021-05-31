const rules = require('./rules/index');

/**
 * @param {object} rules
 * @returns
 */
function configureAsError(rules) {
  return Object.keys(rules)
    .map(key => [`wktaro/${key}`, 2])
    .reduce((prev, cur) => {
      // @ts-ignore
      prev[cur[0]] = cur[1];

      return prev;
    }, {});
}

module.exports = {
  rules: rules,
  configs: {
    recommended: {
      plugins: ['wktaro'],
      parserOptions: {
        ecmaVersion: 2018,
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: configureAsError(rules),
    },
  },
};

