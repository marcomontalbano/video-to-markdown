import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    background: 'src/background/index.ts',
    content: 'src/content/index.ts',
    popup: 'src/popup/index.ts',
  },
  format: ['iife'], // Mantiene tutto in un unico file senza moduli
  target: 'esnext',
  outDir: 'dist',
  minify: false, // Disattiva la minificazione
  splitting: false,
  clean: true,
});
