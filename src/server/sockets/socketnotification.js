const jwt = require('jsonwebtoken');
const prisma = require('./../../libs/db');

const registerNotificationSockets = (socket, io) => {
    socket.on('request_initial_notifications', async (data) => {
        const { token } = data;

        try {
            const secret = process.env.NEXTAUTH_SECRET;
            const decoded = jwt.verify(token, secret); // Decodificamos el token
            const userId = decoded.id; // Obtenemos el ID del usuario

            // Recuperamos las notificaciones del usuario correspondiente
            const notifications = await prisma.notifications.findMany({
                where: { user_id: userId },
                include: {
                    users: {
                        select: { name: true },
                    },
                },
                orderBy: { created_at: 'desc' },
                take: 10,
            });

            // Emitimos las notificaciones iniciales al socket
            socket.emit("initial_notifications", {
                notifications: notifications.map((notif) => ({
                    id: notif.id,
                    type: notif.type,
                    seen: notif.seen,
                    date: notif.created_at,
                    sender: notif.users?.name,
                })),
            });
        } catch (error) {
            console.error('Error al recuperar notificaciones iniciales:', error);
            socket.disconnect(); // Desconectar si hay un error
        }
    });

    socket.on('mark_as_read', async (data) => {
        const { notificationId } = data;
        try {
            await prisma.notifications.update({
                where: { id: notificationId },
                data: { seen: true },
            });
            socket.emit("notification_updated", { notificationId, seen: true });
        } catch (error) {
            console.error("Error al marcar notificación como leída:", error);
        }
    });

    socket.on('new_notification', async (data) => {
        const { token, type, targetId } = data;
        try {
            const secret = process.env.NEXTAUTH_SECRET;
            const decoded = jwt.verify(token, secret); // Decodificamos el token
            const userId = decoded.id; // Obtenemos el ID del usuario

            // Creamos una nueva notificación
            const newNotification = await prisma.notifications.create({
                data: {
                    user_id: userId, // Usamos el ID del usuario decodificado
                    type: type,
                    target_id: targetId,
                    created_at: new Date(),
                },
            });

            // Emitimos la nueva notificación al usuario correspondiente
            io.to(socket.id).emit("new_notification", {
                id: newNotification.id,
                type: newNotification.type,
                seen: newNotification.seen,
                date: newNotification.created_at,
            });
        } catch (error) {
            console.error("Error al verificar token o crear notificación:", error);
            socket.disconnect(); // Desconectar si hay un error
        }
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado de notificaciones');
    });
};

module.exports = registerNotificationSockets;
