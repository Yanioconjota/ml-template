// ************ Require's ************
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// ************ Controller Require ************
const usersController = require('../controllers/usersController');

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

router.get('/profile/:userId/', usersController.profile); /* GET - user profile */

/*** CREATE USER ***/
router.get('/register/', usersController.create); /* GET - Form to create */
router.post('/register/', upload.any(), usersController.store); /* POST -  Store in DB */

/*** EDIT ONE USER ***/
router.get('/edit/:userId', usersController.edit); /* GET - Form to create */
router.put('/edit/:userId', upload.any(), usersController.update); /* PUT - Update in DB */

router.delete('/delete/:userId', usersController.destroy); /* DELETE - Delete from DB */

module.exports = router;
