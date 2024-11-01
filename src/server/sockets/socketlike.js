const jwt = require('jsonwebtoken');
const prisma = require('./../../libs/db');

const registerLikes = (socket, io) => {
    socket.on("like_pregunta", async (data) => {
        const { messageId, token } = data; // Quitamos el uso de "username"

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

            console.log("User autenticado con ID:", authenticatedUserId);

            // Transacción para manejar la creación y eliminación de likes y notificaciones
            const result = await prisma.$transaction(async (tx) => {
                console.log("Iniciando transacción para manejar like y notificación");

                const existingLike = await tx.likes.findFirst({
                    where: {
                        message_id: messageId,
                        user_id: authenticatedUserId,
                    },
                });

                if (existingLike) {
                    console.log("Like existente encontrado, creando notificación y eliminando...");

                    // Crear notificación antes de eliminar el like
                    const removedNotification = await tx.notifications.create({
                        data: {
                            user_id: authenticatedUserId,
                            like_id: existingLike.id,
                            seen: false,
                        },
                    });

                    console.log("Notificación creada por eliminación de like:", removedNotification);

                    // Ahora elimina el like
                    await tx.likes.delete({
                        where: { id: existingLike.id },
                    });

                    console.log(`Like eliminado para el messageId: ${messageId} por el usuario: ${authenticatedUserId}`);
                    return 'removed';
                } else {
                    console.log("No existe like previo, creando uno nuevo...");

                    // Si no ha dado like, crear uno nuevo
                    const newLike = await tx.likes.create({
                        data: {
                            message_id: messageId,
                            user_id: authenticatedUserId,
                        },
                    });

                    console.log("Nuevo like creado:", newLike);

                    // Crear notificación de "nuevo like"
                    const newNotification = await tx.notifications.create({
                        data: {
                            user_id: authenticatedUserId, // Usamos authenticatedUserId en lugar de userId
                            like_id: newLike.id,
                            seen: false,
                        },
                    });

                    console.log("Notificación creada por nuevo like:", newNotification);
                    return 'added'; // Indica que se agregó un like
                }
            });

            console.log("Resultado de la transacción:", result);

            // Contar los likes totales para esta pregunta
            const totalLikes = await prisma.likes.count({
                where: { message_id: messageId },
            });

            console.log("Total de likes para el messageId:", messageId, "Total:", totalLikes);

            // Emitir el nuevo total de likes a todos los clientes
            io.emit("like_count_response", { preguntas_id: messageId, total_likes: totalLikes });

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

module.exports = registerLikes;
