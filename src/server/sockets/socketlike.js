const jwt = require('jsonwebtoken');
const prisma = require('./../../libs/db');

const registerLikes = (socket, io) => {

        socket.on("like_pregunta", async (data) => {
            const { messageId, username, token } = data;

            if (!token) {
                console.error('Token no proporcionado');
                return;
            }

            try {
                const secret = process.env.NEXTAUTH_SECRET;
                const decoded = jwt.verify(token, secret);
                const authenticatedUserId = decoded.id;

                if (!authenticatedUserId) {
                    console.error('Usuario no autenticado');
                    return;
                }

                const user = await prisma.users.findUnique({
                    where: { name: username },
                    select: { id: true },
                });

                if (!user) {
                    console.error('UserId no encontrado para el username:', username);
                    return;
                }

                const userId = user.id;

                const result = await prisma.$transaction(async (tx) => {
                    const existingLike = await tx.likes.findFirst({
                        where: {
                            message_id: messageId,
                            user_id: authenticatedUserId, 
                        },
                    });

                    if (existingLike) {
                        await tx.likes.delete({
                            where: { id: existingLike.id },
                        });
                        return 'removed'; 
                    } else {
                        await tx.likes.create({
                            data: {
                                message_id: messageId,
                                user_id: authenticatedUserId, 
                            },
                        });
                        return 'added'; 
                    }
                });

                const totalLikes = await prisma.likes.count({
                    where: { message_id: messageId },
                });

                io.emit("like_added", { messageId, totalLikes, action: result });

            } catch (error) {
                console.error('Error al manejar like:', error);
            }
        });

        socket.on("get_like_count", async (messageId) => {
            try {
                const totalLikes = await prisma.likes.count({
                    where: { message_id: messageId },
                });
                socket.emit("like_count_response", { preguntas_id: messageId, total_likes: totalLikes });
            } catch (error) {
                console.error('Error al obtener el contador de likes:', error);
            }
        });

        socket.on("check_user_like", async ({ messageId, token }) => {
            try {
                const secret = process.env.NEXTAUTH_SECRET;
                const decoded = jwt.verify(token, secret);
                const authenticatedUserId = decoded.id;

                const existingLike = await prisma.likes.findFirst({
                    where: {
                        message_id: messageId,
                        user_id: authenticatedUserId, 
                    },
                });

                const hasLiked = existingLike !== null;
                socket.emit("user_like_status", { preguntas_id: messageId, has_liked: hasLiked });

            } catch (error) {
                console.error('Error al comprobar el estado de like del usuario:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    };

    console.log('Sockets de likes configurados y escuchando');
;

module.exports = registerLikes;
