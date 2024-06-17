import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          worker: ['./src/worker.ts']
        }
      }
    }
  },
  plugins: [
    nodePolyfills(),
  ],
});

