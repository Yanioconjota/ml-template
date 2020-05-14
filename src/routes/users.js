var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function (req, res, next) {
  res.render('users', {
    title: 'Users',
    nombre: 'Homero',
    apellido: 'Thompson'
  });
});

module.exports = router;
