const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const prisma = require('./../../libs/db');

const registerLikes = (io) => {
    io.on('connection', (socket) => {
        console.log(`Nuevo cliente conectado: ${socket.id}`);

        socket.on("like_pregunta", async (data) => {
            const { messageId, username, token } = data;

            console.log(`Username recibido en el servidor: ${username}`); // Verificar el username recibido

            if (!token) {
                console.error('Token no proporcionado');
                return;
            }

            try {
                const secret = process.env.NEXTAUTH_SECRET;
                const decoded = jwt.verify(token, secret);
                const authenticatedUserId = decoded.id; // Obtener el ID del usuario del token
                console.log(`UserId autenticado desde el token: ${authenticatedUserId}`);

                if (!authenticatedUserId) {
                    console.error('UserId autenticado no encontrado en el token');
                    return;
                }

                // Buscar el userId basado en el username proporcionado por el frontend
                const user = await prisma.users.findUnique({
                    where: {
                        name: username, // Aquí se busca por el username recibido
                    },
                    select: {
                        id: true,
                    },
                });

                if (!user) {
                    console.error('UserId no encontrado para el username:', username);
                    return;
                }

                const userId = user.id; // Aquí tenemos el userId basado en el username
                console.log(`UserId encontrado: ${userId}`);

                const existingLike = await prisma.likes.findFirst({
                    where: {
                        message_id: messageId,
                        user_id: userId, // Usar el userId encontrado
                    },
                });

                if (existingLike) {
                    // Si ya dio like, eliminar el like
                    await prisma.likes.delete({
                        where: {
                            id: existingLike.id,
                        },
                    });
                    console.log(`Like eliminado para el messageId: ${messageId}`);
                } else {
                    // Si no ha dado like, crear uno nuevo
                    await prisma.likes.create({
                        data: {
                            message_id: messageId,
                            user_id: userId, // Almacenar el userId basado en el username
                            user_liked: authenticatedUserId.toString(), // Almacenar el ID del usuario autenticado como cadena
                        },
                    });
                    console.log(`Nuevo like agregado por el usuario con ID: ${authenticatedUserId}`);
                }

                const totalLikes = await prisma.likes.count({
                    where: {
                        message_id: messageId,
                    },
                });

                io.emit("like_added", { messageId, totalLikes, authenticatedUserId });

            } catch (error) {
                console.error('Error al manejar like:', error);
            }
        });

        // Otras funciones del socket...

        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    });

    console.log('Sockets de likes configurados y escuchando');
};

module.exports = registerLikes;
