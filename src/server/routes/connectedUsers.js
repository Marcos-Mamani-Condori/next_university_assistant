const express = require('express');
const router = express.Router();
const prisma = require('./../../libs/db'); 

let connectedUsers = 0;

router.get('/', (req, res) => {
    res.json({ connectedUsers });
});

router.get('/protected', async (req, res) => {
    try {
        const users = await prisma.users.findMany({
            select: {
                major: true, 
            },
        });

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No se encontraron usuarios' });
        }

        const majors = users.map(user => user.major);
        res.json({
            majors, 
        });

    } catch (error) {
        console.error("Error al obtener las carreras de los usuarios:", error);
        res.status(500).json({ message: 'Error al obtener las carreras de los usuarios' });
    }
});

const incrementConnectedUsers = () => {
    connectedUsers++;
};

const decrementConnectedUsers = () => {
    if (connectedUsers > 0) {
        connectedUsers--;
    }
};

const getConnectedUsers = () => {
    return connectedUsers;
};

const handleusers = (socket) => {
    incrementConnectedUsers();
    console.log(`Usuario conectado. Total de usuarios: ${getConnectedUsers()}`);

    socket.on('disconnect', () => {
        decrementConnectedUsers();
        console.log(`Usuario desconectado. Total de usuarios: ${getConnectedUsers()}`);
    });
};

module.exports = {
    router,
    incrementConnectedUsers,
    decrementConnectedUsers,
    getConnectedUsers,
    handleusers,
};
