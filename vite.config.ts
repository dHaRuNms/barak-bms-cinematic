import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 4173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  // The optional WebGL engine is lazy-loaded, ~135 KB gzip. Keep a deliberate budget.
  build: { rollupOptions: { input: { main: 'index.html', company: 'company.html' } }, target: 'es2022', sourcemap: false, chunkSizeWarningLimit: 600 },
});
