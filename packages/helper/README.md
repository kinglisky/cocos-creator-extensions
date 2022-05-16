# vite-plugin-cocos-helper

cocos creator extensions 开发 vite 辅助插件。

安装：

```base
npm i vite-plugin-cocos-helper -D
yarn add vite-plugin-cocos-helper -D
pnpm add vite-plugin-cocos-helper -D
```

使用：

```ts
import path from 'path';
import { defineConfig } from 'vite';
import cocosHelper from 'vite-plugin-cocos-helper';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        outDir: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        cocosHelper({
            path: {
                // package.json 文件入口，可选默认 'package.json
                package: path.resolve(__dirname, 'package.json'),
                // i18n 文件加入口，可选默认 'i18n'
                i18n: path.resolve(__dirname, 'i18n'),
                // 静态文件入口，可选默认 'static'
                static: path.resolve(__dirname, 'static'),
            },
        }),
    ],
});
```

使用时在 package.json 直接配置元素路径，应用构建完成后插件会自动在 `outDir` 生成对应的 `package.json`、`i18n` 与 `static` 文件：

```json
// 原始 package.json
{
    // 入口直接使用原始路径...
    "main": "app/main.ts",
    "module": "app/main.ts",
    "panels": {
        "default": {
            "title": "插件自定义面板",
            "type": "dockable",
            "main": "app/panel/index.ts",
            "icon": "static/icon.png"
        }
    }
}
```

输出结果：

```json
// 输出 package.json
{
    // ....
    "main": "main.js",
    "module": "main.js",
    "panels": {
        "default": {
            "title": "插件自定义面板",
            "type": "dockable",
            "main": "panel.js",
            "icon": "static/icon.png"
        }
    }
}
```

outDir 结构：

```
.
├── assets
│   └── panel.e388cfa6.css
├── i18n
│   ├── en.js
│   └── zh.js
├── main.js
├── package.json
├── panel.js
└── static
    └── icon.png
```
