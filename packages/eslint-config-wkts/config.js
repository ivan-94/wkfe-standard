const { looseRules, rules } = require('eslint-config-wk/config');

exports.createConfig = function createConfig(loose = false) {
  return {
    extends: ['wk', 'standard-with-typescript', 'prettier', 'prettier/@typescript-eslint'],
    rules: {
      ...(loose ? looseRules : {}),
    },
    overrides: [
      {
        // typescripts
        files: ['*.ts', '*.tsx'],
        rules: {
          ...rules,
          // eslint no-shadow 存在问题，用 @typescript-eslint/no-shadow 取代
          'no-shadow': 'off',
          'no-unused-vars': 'off',
          'default-param-last': 'off',
          'lines-between-class-member': 'off',

          '@typescript-eslint/no-shadow': 'error',
          '@typescript-eslint/explicit-function-return-type': 'off',
          '@typescript-eslint/restrict-plus-operands': 'warn',
          '@typescript-eslint/no-unused-vars': 'error',
          '@typescript-eslint/strict-boolean-expressions': 'off',
          '@typescript-eslint/restrict-template-expressions': 'off',
          '@typescript-eslint/no-non-null-assertion': 'warn',
          '@typescript-eslint/no-floating-promises': 'off',
          '@typescript-eslint/default-param-last': ['warn'],
          '@typescript-eslint/promise-function-async': 'off',
          '@typescript-eslint/prefer-readonly': 'off',
          '@typescript-eslint/lines-between-class-members': 'off',
          ...(loose ? exports.looseRules : {}),
        },
      },
    ],
    parserOptions: {
      warnOnUnsupportedTypeScriptVersion: true,
      project: './tsconfig.json',
    },
  };
};

exports.looseRules = {
  '@typescript-eslint/no-unused-vars': 'warn',
  '@typescript-eslint/consistent-type-definitions': 'warn',
  '@typescript-eslint/no-shadow': 'warn',
};
