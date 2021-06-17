const { buildDocsMeta } = require('../utils');
const { API_LIST, GLOBAL_OBJECT } = require('../constants');

const MESSAGE = '请统一使用 wxApi.* 来使用 Taro API';

/**
 * 从 wxApi 中导入Taro API
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: buildDocsMeta(MESSAGE, 'wxapi'),
  },

  create(context) {
    return {
      MemberExpression: path => {
        if (
          path.object.type === 'Identifier' &&
          GLOBAL_OBJECT.has(path.object.name) &&
          path.property.type === 'Identifier' &&
          API_LIST.has(path.property.name) &&
          !context.getFilename().includes('wxApi')
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
