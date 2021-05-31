const { buildDocsMeta } = require('../utils');
const { STYLE_EXTS } = require('../constants');

const MESSAGE = '请统一使用 CSS Module 进行样式编写';

/**
 * CSS Module
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: buildDocsMeta(MESSAGE, 'css-module'),
  },

  create(context) {
    /**
     * @param {any} path
     * @param {string} source
     */
    function checkStyleRequire(path, source) {
      if (STYLE_EXTS.some(ext => source.endsWith(ext)) && !source.includes('.module.')) {
        context.report({
          message: MESSAGE,
          node: path,
        });
      }
    }
    return {
      ImportDeclaration(path) {
        const source = /** @type {string} */ (path.source.value);
        checkStyleRequire(path, source);
      },
      CallExpression(path) {
        if (
          path.callee.type === 'Identifier' &&
          path.callee.name === 'require' &&
          path.arguments.length === 1 &&
          path.arguments[0].type === 'Literal'
        ) {
          const source = /** @type {string} */ (path.arguments[0].value);
          checkStyleRequire(path, source);
        }
      },
    };
  },
};
