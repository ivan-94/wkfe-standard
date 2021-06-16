module.exports = {
  extends: ['wkts', require.resolve('./index')],
  rules: {},
  overrides: [
    {
      // typescripts
      files: ['*.ts', '*.tsx'],
      rules: {},
      parser: '@typescript-eslint/parser',
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: true,
        ecmaVersion: 'es11',
        lib: ['esNext'],
        project: './tsconfig.json',
      },
    },
  ],
};
