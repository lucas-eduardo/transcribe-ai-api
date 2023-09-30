import swc from 'unplugin-swc'
import tsConfigPaths from 'vite-tsconfig-paths'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    exclude: [...configDefaults.exclude, '**/data/pg/**'],
    globals: true,
    root: './',
    setupFiles: ['./test/setup-e2e.ts'],
    testTimeout: 5800,
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})
