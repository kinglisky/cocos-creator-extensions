const path = require('path');
const { createServer } = require('vite');

const port = 3000;
const inspectorDir = path.resolve(__dirname, '../extensions/inspector');

async function main() {
  const server = await createServer({
    // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
    root: inspectorDir,
    server: {
      port,
    },
  });
  await server.listen();
  console.log(`ttp://localhost:${port}`);
}

main().catch((error) => {
    console.log(error);
    process.exit(0);
});
