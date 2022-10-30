const { userConected, userDisconect, userList, saveConversation } = require("../controllers/sockets");
const { comprobarJWT } = require("../helpers/jwt");


class Sockets {

    constructor(io) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', async (socket) => {

            const [valido, uid] = comprobarJWT(socket.handshake.query['x-token'])

            if (!valido) {
                console.log('socket no identificado')
                return socket.disconnect();
            }
            await userConected(uid)

            //unir usuario a una sala de socket-io
            socket.join(uid);

            //TODO validar jwt
            //si token no es valido, desconectar

            //TODO saber que usuario esta activo mediante uid

            //TODO emitir todos los usuarios conectados

            this.io.emit('users-list', await userList())

            //TODO Socket join, uid

            //TODO escuchar cuando cliente manda mensaje
            socket.on('mensaje-personal', async (payload) => {
                const message = await saveConversation(payload);

                this.io.to(payload.from).emit('mensaje-personal', message)
                this.io.to(payload.to).emit('mensaje-personal', message)
            })

            socket.on('send-notification', (payload) => {
                this.io.to(payload.to).emit('getNotification', {
                    notifi: payload.msgSinLeer,
                    to: payload.to,
                    from: payload.from
                })
            })

            //TODO disconected
            socket.on('disconnect', async () => {
                await userDisconect(uid);
                this.io.emit('users-list', await userList())
            })
            //TODO emitir usuarios conectados
        });
    }



}


module.exports = Sockets;