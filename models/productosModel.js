const fs = require('fs');
let getData = fs.readFileSync('data/productos.json', 'utf-8');
let producto = JSON.parse(getData);

module.exports = producto;