import tsconfigPaths from 'vite-tsconfig-paths'; // only if you are using custom tsconfig paths
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    // 设置超时时间
    testTimeout: 60000,
  },
  plugins: [tsconfigPaths()],  // only if you are using custom tsconfig paths
});
