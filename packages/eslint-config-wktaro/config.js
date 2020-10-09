const { looseRules } = require('eslint-config-wkreact/config');
const { looseRules: commonLooseRules } = require('eslint-config-wk/config');

exports.createConfig = function createConfig(loose = false) {
  return {
    extends: ['wkreact', 'taro'],
    plugins: [],
    rules: {
      'import/prefer-default-export': 'off',
      'react/jsx-fragments': 'error',
      'react/jsx-no-bind': 'off',
      'react/sort-comp': [
        'warn',
        {
          order: [
            '/^config/',
            'type-annotations',
            'static-variables',
            'static-methods',
            'instance-variables',
            'computed',
            'lifecycles',
            '/^on.+$/',
            'everything-else',
            '/^render.+$/',
            'render',
          ],
          groups: {
            computed: ['getters', 'setters'],
            lifecycles: [
              'constructor',
              'componentWillPreload',
              'componentWillMount',
              'componentDidMount',
              'componentWillReceiveProps',
              'shouldComponentUpdate',
              'componentWillUpdate',
              'componentDidUpdate',
              'componentWillUnmount',
              'componentDidShow',
              'componentDidHide',
              'componentDidCatchError',
              'componentDidNotFound',
            ],
          },
        },
      ],
      'react/no-deprecated': 'error',
      ...(loose ? commonLooseRules : {}),
      ...(loose ? looseRules : {}),
      ...(loose ? exports.looseRules : {}),
    },
    settings: {
      react: {
        pragma: 'Taro',
        version: 'detect',
      },
    },
  };
};

exports.looseRules = {
  'import/first': 'warn',
};
