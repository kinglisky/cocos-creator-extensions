const cube = require('./cube.json');
const fs = require('fs');
const data = {};

Object.entries(cube).forEach(([k, v]) => {
  data[v.displayName] = v.value;
});

// fs wiriteFileSync
fs.writeFileSync('./cube-data.json', JSON.stringify(data, null, 2));
