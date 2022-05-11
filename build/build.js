const path = require('path');
const { build } = require('vite');

const inspectorDir = path.resolve(__dirname, '../extensions/inspector');

async function main() {
  await build({
    root: inspectorDir,
  });
}

main();
