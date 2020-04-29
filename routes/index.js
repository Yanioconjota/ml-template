var express = require('express');
var router = express.Router();
let ProductModel = require('../models/productosModel');

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('index', 
  { title: 'Home',
    nombre: 'Homero',
    apellido: 'Thompson',
    listaProductos: ProductModel
  });
});

module.exports = router;
