import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

/*
 * The suite runs in two zones on purpose: `npm test` in Europe/London, the business
 * zone, and `npm run test:utc` in UTC, which is what the serverless runtime uses. A
 * date computed without an explicit zone passes in one and fails in the other.
 *
 * Set here rather than in the npm script so `npm test` pins the zone on every
 * platform with no extra dependency. It is a default, not an override: a TZ given on
 * the command line wins, which is how `test:utc` gets UTC. An empty TZ counts as
 * unset, because Node would otherwise read it as UTC. The test workers are started
 * after this runs and inherit it.
 */
process.env.TZ ||= 'Europe/London';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.tsx',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'src/app/layout.tsx',
        'src/app/page.tsx',
      ],
    },
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
