exports.createConfig = function createConfig(loose = false) {
  return {
    extends: ['standard-react', 'plugin:react-hooks/recommended', 'prettier', 'prettier/react'],
    plugins: [],
    rules: {
      ...exports.rules,
      ...(loose ? exports.looseRules : {}),
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  };
};

exports.rules = {
  'react/self-closing-comp': 'off',
  'react/prop-types': 'off',
  'react/style-prop-object': 'error',
  'react/jsx-boolean-value': 'warn',
  'react/no-unsafe': 'error',
  'react/no-deprecated': 'error',
  'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.tsx'] }],
};

exports.looseRules = {
  'react/no-unsafe': 'warn',
  'react/no-deprecated': 'warn',
};
