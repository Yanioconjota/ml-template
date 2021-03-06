// ************ Require's ************
const express = require('express');
const router = express.Router();

// ************ Controller Require ************
const productsController = require('../controllers/productsController');

const logsMiddleware = require('../middlewares/logsDbMiddleware'); // Middleware de logs en ciertas rutas

router.get('/', productsController.root); /* GET - All products */
router.get('/detail/:productId/', productsController.detail); /* GET - Product detail */

/*** CREATE ONE PRODUCT ***/
router.get('/create/', productsController.create); /* GET - Form to create */
router.post('/create/', logsMiddleware, productsController.store); /* POST - Store in DB */

/*** EDIT ONE PRODUCT ***/
router.get('/edit/:productId', productsController.edit); /* GET - Form to create */
router.put('/edit/:productId', logsMiddleware, productsController.update); /* PUT - Update in DB */

/*** DELETE ONE PRODUCT***/
router.delete('/delete/:productId', logsMiddleware, productsController.destroy); /* DELETE - Delete from DB */

module.exports = router;
