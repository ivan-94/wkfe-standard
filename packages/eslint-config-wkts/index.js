module.exports = {
  extends: ['wk', 'standard-with-typescript', 'prettier', 'prettier/@typescript-eslint'],
  rules: {},
  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: true,
    project: './tsconfig.json',
  },
}
