import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/SingleBackgammon/',
  plugins: [react()],
  build: {
    outDir: 'public',
    // Disable minification and tree-shaking so console logs remain in the
    // production bundle, making it easier to debug issues in the deployed app.
    minify: false,
    rollupOptions: {
      treeshake: false,
    },
  },
});
