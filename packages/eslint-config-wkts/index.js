module.exports = {
  extends: ['wk', 'standard-with-typescript', 'prettier', 'prettier/@typescript-eslint'],
  rules: {
    // eslint no-shadow 存在问题，用 @typescript-eslint/no-shadow 取代
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
  },
  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: true,
    project: './tsconfig.json',
  },
};
