const path = require('path');
const { build } = require('vite');

const inspectorDir = path.resolve(__dirname, '../extensions/inspector');

async function main() {
    const config = await build({
        root: inspectorDir,
        build: { watch: {} },
    });
    return config;
}

main();
