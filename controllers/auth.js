const { response } = require("express");
const bcrypt = require('bcryptjs')
const User = require('../models/user');
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {

    try {
        const { email, password, nombre } = req.body;

        //verificar que el email no exista
        const existEmail = await User.findOne({ email });

        if (existEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'el correo ya existe'
            })
        }

        //guardar usario en DB
        const usuario = new User(req.body);

        //TODO: encryptar contrasena
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        //generar el JWT 
        const token = await generarJWT(usuario.id)

        return (res.json({
            ok: true,
            usuario,
            token
        }))


    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            err: error,
            msg: "error del servidor"
        });
    }

}

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        //verificar correo
        const usuarioDB = await User.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: "email no encontrado"
            })
        }

        //validar password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: "password invalida"
            })
        }

        //generar token
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    } catch (error) {
        console.log(error);

    }
}

const renewToken = async (req, res = response) => {

    const uid = req.uid;
    //generar nuevo jwt
    const token = await generarJWT(uid);

    //obtener usuario por id 
    const user = await User.findById(uid);

    res.json({
        ok: true,
        user,
        token
    })
}

module.exports = {
    crearUsuario,
    login,
    renewToken
}