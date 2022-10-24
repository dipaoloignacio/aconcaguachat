
const { Router } = require('express');
const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

//crear nuevo user
router.post('/new', [
    check('nombre', 'el nombre es obligatorio').not().isEmpty(),
    check('password', 'la contraseña es obligatoria').not().isEmpty(),
    check('email', 'el email es obligatorio').isEmail(),
    validarCampos
], crearUsuario);

//login
router.post('/', [
    check('email', 'el email es obligatorioo').isEmail(),
    check('password', 'el password es obligatorioo').not().isEmpty(),
    validarCampos
], login);

//renew token
router.get('/renew', validarJWT, renewToken);

module.exports = router;