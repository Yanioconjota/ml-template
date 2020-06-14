// ************ Require's ************
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { check, validationResult, body } = require('express-validator');

// ************ Controller Require ************
const usersController = require('../controllers/usersController');

const logsMiddleware = require('../middlewares/logsDbMiddleware'); // Middleware de logs en ciertas rutas

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/users');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

let upload = multer({
  storage: storage
});

router.get('/profile/:userId', usersController.profile); /* GET - user profile */

/*** CREATE USER ***/
router.get('/register', usersController.create); /* GET - Form to create */
router.post('/register', [
  check('email').isEmail().withMessage('Debe ingresar un e-mail correcto'),
  check('name').isLength({
    min: 4,
    max: 100
  }).withMessage('El nombre es inválido'),
  check('lastname').isLength({
    min: 3,
    max: 100
  }).withMessage('El apellido es inválido'),
  check('password').custom((value, { req })=> {
    return value === req.body.passwordConfirm;
  }).withMessage('La contraseña no coincide')
], logsMiddleware, usersController.store); /* POST -  Store in DB */

/*** EDIT ONE USER ***/
router.get('/edit/:userId', usersController.edit); /* GET - Form to create */
router.put('/edit/:userId', upload.any(), logsMiddleware, usersController.update); /* PUT - Update in DB */


router.delete('/delete/:userId', logsMiddleware, usersController.destroy); /* DELETE - Delete from DB */

router.get('/login', usersController.login); /* GET - Form to create */
router.post('/login', usersController.logUser); /* GET - Form to create */
// router.post('/login', usersController.validate); /* Post - Validation login */
module.exports = router;
