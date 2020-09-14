module.exports = {
  extends: ['standard-react', 'plugin:react-hooks/recommended', 'prettier', 'prettier/react'],
  plugins: [],
  rules: {
    'react/self-closing-comp': 'off',
    'react/prop-types': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
