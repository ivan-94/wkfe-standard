const { buildDocsMeta } = require('../utils');
const { DATA_SET_WHITE_LIST } = require('../constants');

const MESSAGE = '不允许使用 data-set, 该功能不支持跨平台';

/**
 * 禁止使用 data-set
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: buildDocsMeta(MESSAGE, 'dataset'),
  },

  create(context) {
    return {
      /**
       *
       * @param {{name: {type: string, name: string}}} path
       */
      JSXAttribute: (path) => {
        if (
          path.name.type === 'JSXIdentifier' &&
          path.name.name.startsWith('data-') &&
          !DATA_SET_WHITE_LIST.has(path.name.name)
        ) {
          context.report({
            message: MESSAGE,
            // @ts-expect-error
            node: path,
          });
        }
      },
    };
  },
};
