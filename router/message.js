const {Router} = require('express');
const { obtenerChat } = require('../controllers/message');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:de', validarJWT, obtenerChat);


module.exports = router;
