import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import shadowDomCss from 'vite-plugin-shadow-dom-css';
// @ts-ignore
import cocosHelper from 'vite-plugin-cocos-helper';
import packageJSON from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        shadowDomCss(),
        cocosHelper({
            package: packageJSON,
            i18nPath: path.resolve(__dirname, './i18n'),
        }),
    ],
    publicDir: path.resolve(__dirname, './static'),
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
