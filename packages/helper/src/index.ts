import fs from 'fs';
import path from 'path';
import type { Plugin, BuildOptions } from 'vite';
import type { OutputAsset } from 'rollup';

interface ICocosHelperOptions {
    package: Record<string, any>;
    config?: Record<string, any>;
    i18nPath: string;
}

export default function cocosRollupHelper(
    options: ICocosHelperOptions
): Plugin {
    const outputPackage = Object.assign(options.package, options.config || {});
    let originManifest: BuildOptions['manifest'] = false;
    return {
        name: 'vite-plugin-cocos-helper',

        config(config) {
            originManifest = config.build?.manifest;
            if (!originManifest) {
                // 最终的 package 文件中路径替换依赖 manifest
                config.build = Object.assign(config.build || {}, {
                    manifest: true,
                });
            }
            return config;
        },

        async generateBundle() {
            // 生成 i18n 文件
            const emitI18n = async () => {
                const { i18nPath } = options;
                const i18nFiles = await fs.promises.readdir(
                    path.resolve(i18nPath)
                );
                if (!i18nFiles.length) return;
                const tasks = i18nFiles.map(async (file) => {
                    let content = await fs.promises.readFile(
                        path.resolve(i18nPath, file),
                        'utf-8'
                    );
                    const isJSON = file.endsWith('.json');
                    if (isJSON) {
                        content = `module.exports = ${content}`;
                    }
                    this.emitFile({
                        type: 'asset',
                        fileName: `i18n/${file.replace(/\.\w+$/, '')}.js`,
                        source: content,
                    });
                });
                await Promise.all(tasks);
            };
            // 生成 package.json
            this.emitFile({
                type: 'asset',
                fileName: 'package.json',
                source: JSON.stringify(outputPackage),
            });
            await emitI18n();
        },

        async writeBundle(options, bundle) {
            // 读取 package.json 文件
            const packageAsset = bundle['package.json'] as OutputAsset;
            const packageJSON = JSON.parse(packageAsset.source as string);
            // 读取文件构建清单
            const manifestAsset = bundle['manifest.json'] as OutputAsset;
            const manifestJSON = JSON.parse(manifestAsset.source as string);
            const files = Object.values(manifestJSON) as Array<{
                src: string;
                file: string;
            }>;
            // 替换 packge.json 中配置的插件构建路径
            packageAsset.source = JSON.stringify(packageJSON, (_, v) => {
                if (typeof v === 'string') {
                    const manifestInfo = files.find((file) =>
                        v.endsWith(file.src)
                    );
                    if (manifestInfo) {
                        return v.replace(manifestInfo.src, manifestInfo.file);
                    }
                    return v;
                }
                return v;
            });
            // 复写 package.json
            await fs.promises.writeFile(
                path.resolve(`${options.dir}/package.json`),
                packageAsset.source
            );
            // 判断是否需要 manifest 文件
            if (!originManifest) {
                await fs.promises.unlink(`${options.dir}/manifest.json`);
            }
        },
    };
}
