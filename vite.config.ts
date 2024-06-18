import {resolve} from "path"
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          worker: ['./src/worker.ts']
        }
      }
    },
    lib: {
      entry: resolve(__dirname, "./src/main.ts"),
      formats: ["es"]
  },
  }
});

