const jwt = require("jsonwebtoken");

const validarJWT = (req, res, next) => {

    try {
        const token = req.header('x-token');

        if(!token){
            return res.status(401).json({
                ok:false,
                msg: 'no hay token'
            })
        }

        const { uid } = jwt.verify(token, process.env.JWT_KEY);

        req.uid = uid;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            errors: 'token no valido'
        });
    }

}

module.exports = {
    validarJWT
}