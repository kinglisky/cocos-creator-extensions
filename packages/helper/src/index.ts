// import path from 'path';
import { OutputOptions, Plugin } from 'rollup';

interface ICocosHelperOptions {
    packagePath: string;
    extensionConfigPath: string;
}

export default function cocosHelper(options: Partial<ICocosHelperOptions> = {}): Plugin {
    console.log('cocosHelper', process.cwd());
    const opts = {
        ...{
            packagePath: require('path').join(__dirname, 'package.json'),
        },
        ...options,
    };
    return {
        name: 'cocos-helper',
        options(inputOptions) {
            console.log('cocosHelper options', inputOptions);
        },
        generateBundle(options, bundle) {
            console.log(options);
            console.log(Object.keys(bundle));
            this.emitFile({
                type: 'asset',
                fileName: 'test.json',
                source: JSON.stringify({
                    name: 'test',
                }),
            });
        },
    };
}
