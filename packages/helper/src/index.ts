// import path from 'path';
import { OutputOptions, Plugin } from 'rollup';

interface ICocosHelperOptions {
    package: Record<string, any>;
    config?: Record<string, any>;
    i18nPath: string;
}

export default function cocosHelper(options: ICocosHelperOptions): Plugin {
    const outputPackage = Object.assign(options.package, options.config || {});
    return {
        name: 'cocos-helper',
        options(inputOptions) {
            console.log('cocosHelper options', inputOptions);
        },
        generateBundle(options, bundle) {
            console.log(this.meta);
            console.log(options);
            console.log(Object.keys(bundle));
            this.emitFile({
                type: 'asset',
                fileName: 'package.json',
                source: JSON.stringify(outputPackage, null, 2),
            });
        },
    };
}
