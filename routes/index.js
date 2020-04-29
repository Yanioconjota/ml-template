var express = require('express');
var router = express.Router();
let PrductModel = require('../models/productosModel');

/* GET login page. */
router.get('/', function(req, res, next) {
  console.log(PrductModel);
  
  
  res.render('index', 
  { title: 'Login',
    nombre: 'Homero',
    apellido: 'Thompson',
    listaProductos: PrductModel
  });
});

module.exports = router;
