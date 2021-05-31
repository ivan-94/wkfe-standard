const { buildDocsMeta } = require('../utils');

const MESSAGE = 'redux connect 必须设置 forwardRef 参数';

/**
 * redux connect 必须设置 forwardRef 参数
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: buildDocsMeta(MESSAGE, 'redux-connect'),
  },

  create(context) {
    return {
      CallExpression: (path) => {
        if (
          path.callee.type === 'Identifier' &&
          path.callee.name === 'connect' &&
          (path.arguments.length !== 4 ||
            path.arguments[3].type !== 'ObjectExpression' ||
            !path.arguments[3].properties.some(
              (i) => i.type === 'Property' && i.key.type === 'Identifier' && i.key.name === 'forwardRef'
            ))
        ) {
          context.report({
            message: MESSAGE,
            node: path,
          });
        }
      },
    };
  },
};
