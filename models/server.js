// Servidor de Express
const express = require('express');
const http = require('https');
const socketio = require('socket.io');
const path = require('path');
const cors = require('cors');
const Sockets = require('./sockets');
const { dbConection } = require('../database/Confing');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        //conectar a DB
        dbConection();

        // Http server
        this.server = http.createServer(this.app);

        // Configuraciones de sockets
        this.io = socketio(this.server, {
            cors: {
                origin: ["https://aconcaguachat.herokuapp.com"],
            }
        });
    }

    middlewares() {
        // Desplegar el directorio público
        this.app.use(express.static(path.resolve(__dirname, '../public')));

        //TODO cors
        this.app.use(cors());

        //parseo del body
        this.app.use(express.json());

        //API endpoints
        this.app.use('/api/login', require('../router/auth'));
        this.app.use('/api/message', require('../router/message'));
    }

    // Esta configuración se puede tener aquí o como propieda de clase
    // depende mucho de lo que necesites
    configurarSockets() {
        new Sockets(this.io);
    }

    execute() {

        // Inicializar Middlewares
        this.middlewares();

        // Inicializar sockets
        this.configurarSockets();

        // Inicializar Server
        this.server.listen(this.port, () => {
            console.log('Server corriendo en puerto:', this.port);
        });
    }
}

module.exports = Server;