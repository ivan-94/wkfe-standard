module.exports = {
  extends: ['standard-react', 'plugin:react-hooks/recommended', 'prettier', 'prettier/react'],
  plugins: [],
  rules: {
    'react/self-closing-comp': 0,
    'react/prop-types': 0,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
