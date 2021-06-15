const { looseRules, rules } = require('eslint-config-wk/config');

exports.createConfig = function createConfig(loose = false) {
  return {
    extends: ['wk', 'standard-with-typescript', 'prettier'],
    rules: {
      ...(loose ? looseRules : {}),
    },
    overrides: [
      {
        // typescripts
        files: ['*.ts', '*.tsx'],
        rules: {
          ...rules,
          'default-param-last': 'off',
          'dot-notation': 'off',
          'lines-between-class-member': 'off',
          'no-shadow': 'off',
          'no-undef': 'off',
          'no-unused-expressions': 'off',
          'no-unused-vars': 'off',
          camelcase: 'off',
          '@typescript-eslint/array-type': 'warn',
          '@typescript-eslint/default-param-last': ['warn'],
          '@typescript-eslint/dot-notation': 'warn',
          '@typescript-eslint/explicit-function-return-type': 'off',
          '@typescript-eslint/lines-between-class-members': 'off',
          '@typescript-eslint/method-signature-style': 'off',
          '@typescript-eslint/naming-convention': 'warn',
          '@typescript-eslint/no-empty-interface': 'warn',
          '@typescript-eslint/no-floating-promises': 'off',
          '@typescript-eslint/no-non-null-assertion': 'warn',
          '@typescript-eslint/no-shadow': 'error',
          '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'warn',
          '@typescript-eslint/no-unused-expressions': 'warn',
          '@typescript-eslint/no-unused-vars': 'warn',
          '@typescript-eslint/prefer-includes': 'warn',
          '@typescript-eslint/prefer-nullish-coalescing': 'warn',
          '@typescript-eslint/prefer-optional-chain': 'warn',
          '@typescript-eslint/prefer-readonly': 'off',
          '@typescript-eslint/promise-function-async': 'off',
          '@typescript-eslint/restrict-plus-operands': 'warn',
          '@typescript-eslint/restrict-template-expressions': 'off',
          '@typescript-eslint/strict-boolean-expressions': 'off',
          ...(loose ? exports.looseRules : {}),
        },
        parserOptions: {
          warnOnUnsupportedTypeScriptVersion: true,
          ecmaVersion: 'es11',
          lib: ['esNext'],
          project: './tsconfig.json',
        },
      },
    ],
  };
};

exports.looseRules = {
  '@typescript-eslint/no-unused-vars': 'warn',
  '@typescript-eslint/consistent-type-definitions': 'warn',
  '@typescript-eslint/no-shadow': 'warn',
  '@typescript-eslint/naming-convention': 'warn',
};
