import os from 'os';
import fs from 'fs';
import path from 'path';
import merge from 'lodash/merge';
import type { Plugin, BuildOptions } from 'vite';
import type { OutputAsset } from 'rollup';

interface ICocosHelperOptions {
    path?: {
        // package.json 文件入口
        package?: string;
        // i18n 文件入口
        i18n?: string;
        // 静态文件入口
        static?: string;
    };
    zip?: boolean;
}

const defaultOptions = {
    path: {
        package: 'package.json',
        i18n: 'i18n',
        static: 'static',
    },
    zip: false,
};

const isWindows = os.platform() === 'win32';

function slash(p: string): string {
    return p.replace(/\\/g, '/');
}
function normalizePath(id: string): string {
    return path.posix.normalize(isWindows ? slash(id) : id);
}

function resolvePath(root: string, p: string): string {
    return path.join(root, normalizePath(path.relative(root, p)));
}

export default function cocosRollupHelper(
    cocosHelperOptions?: ICocosHelperOptions
): Plugin {
    let configResolved: any = null;
    let originManifest: BuildOptions['manifest'] = false;
    const mergeHelperOptions = merge(
        {},
        defaultOptions,
        cocosHelperOptions || {}
    );
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

        configResolved(config) {
            configResolved = config;
        },

        async generateBundle() {
            // 生成 i18n 文件
            const emitI18n = async () => {
                const i18nDir = resolvePath(
                    configResolved.root,
                    mergeHelperOptions.path.i18n
                );
                const i18nFiles = await fs.promises.readdir(i18nDir);
                if (!i18nFiles.length) return;
                const tasks = i18nFiles.map(async (file) => {
                    let content = await fs.promises.readFile(
                        path.resolve(i18nDir, file),
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
            await emitI18n();

            // 复制静态文件
            const emitStatic = async () => {
                // 复制文件
                const staticDir = resolvePath(
                    configResolved.root,
                    mergeHelperOptions.path.static
                );
                const dirName = path.relative(configResolved.root, staticDir);
                const staticFiles = await fs.promises.readdir(staticDir);
                if (!staticFiles.length) return;
                const tasks = staticFiles.map(async (file) => {
                    const filePath = path.resolve(staticDir, file);
                    const uint8Array = await fs.promises.readFile(
                        filePath,
                        null
                    );
                    this.emitFile({
                        type: 'asset',
                        fileName: `${dirName}/${file}`,
                        source: uint8Array,
                    });
                });
                await Promise.all(tasks);
                console.log(dirName, staticFiles);
            };

            await emitStatic();

            // 生成 package.json
            const packagePath = resolvePath(
                configResolved.root,
                mergeHelperOptions.path.package
            );
            const packageJSON = await fs.promises.readFile(
                packagePath,
                'utf-8'
            );
            this.emitFile({
                type: 'asset',
                fileName: 'package.json',
                source: packageJSON,
            });
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
            packageAsset.source = JSON.stringify(
                packageJSON,
                (_, v) => {
                    if (typeof v === 'string') {
                        const manifestInfo = files.find((file) =>
                            v.endsWith(file.src)
                        );
                        if (manifestInfo) {
                            return v.replace(
                                manifestInfo.src,
                                manifestInfo.file
                            );
                        }
                        return v;
                    }
                    return v;
                },
                2
            );
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
