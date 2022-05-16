import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import shadowDomCss from 'vite-plugin-shadow-dom-css';
// @ts-ignore
import cocosHelper from 'vite-plugin-cocos-helper';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        shadowDomCss(),
        cocosHelper({
            zip: process.env.ZIP ? { fileName: 'inspector-example.zip' } : undefined,
        }),
    ],
    build: {
        rollupOptions: {
            input: {
                main: path.join(__dirname, './app/main.ts'),
                panel: path.join(__dirname, './app/panel/index.ts'),
            },
            output: {
                format: 'cjs',
                entryFileNames: '[name].js',
                chunkFileNames: 'chunks/[name].js',
            },
        },
        minify: true,
        emptyOutDir: false,
    },
});
