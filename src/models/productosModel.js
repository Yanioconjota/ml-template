const fs = require('fs');
let getData = fs.readFileSync('./src/data/productos.json', 'utf-8');
let producto = JSON.parse(getData);

module.exports = producto;