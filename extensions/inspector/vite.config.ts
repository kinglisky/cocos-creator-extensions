import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import shadowDomCss from 'vite-plugin-shadow-dom-css';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), shadowDomCss()],
  publicDir: path.resolve(__dirname, './static'),
  build: {
    rollupOptions: {
      input: {
        main: path.join(__dirname, 'src/main.ts'),
        panel: path.join(__dirname, 'src/index.ts'),
      },
      output: {
        format: 'cjs',
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name].js',
      },
    },
    manifest: true,
    minify: false,
    emptyOutDir: false,
  },
});
