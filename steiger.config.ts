import { defineConfig } from 'steiger'
import fsd from '@feature-sliced/steiger-plugin'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // `providers` is the conventional FSD name for app-level composition
    // (store, auth, dialogs). Steiger considers it a "what, not why" name.
    files: ['./src/app/providers', './src/app/providers/**'],
    rules: {
      'fsd/segments-by-purpose': 'off',
    },
  },
  {
    ignores: ['**/node_modules/**', '**/dist/**'],
  },
])
