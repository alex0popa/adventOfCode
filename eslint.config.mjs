// Lean flat ESLint config (ESLint 9+) — TypeScript + Node, formatting via Prettier.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import n from 'eslint-plugin-n';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  { ignores: ['node_modules', 'dist'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  n.configs['flat/recommended'],
  prettierRecommended,
  {
    rules: {
      'no-console': 'off',
      'func-names': 'off',
      'no-plusplus': 'off',
      'n/no-process-exit': 'off',
      'class-methods-use-this': 'off',
      // core no-unused-vars is TS-unaware; use the TS-aware variant instead
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      // eslint-plugin-n can't resolve extensionless TS imports; TypeScript
      // itself already validates them, so these are false positives here.
      'n/no-missing-import': 'off',
      'n/no-missing-require': 'off',
    },
  },
);
