module.exports = {
  extends: ['wkts', require.resolve('./loose')],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: './tsconfig.json',
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
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
