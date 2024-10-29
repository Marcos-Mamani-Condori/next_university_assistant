const jwt = require('jsonwebtoken');
const prisma = require('./../../libs/db');

const registerSockets = (socket, io) => {
    const sendInitialMessages = async () => {
        try {
            console.log("Recuperando mensajes iniciales...");
            const messages = await prisma.messages.findMany({
                include: {
                    users: {
                        select: {
                            name: true,
                            major: true,
                        },
                    },
                },
                orderBy: {
                    id: 'desc',
                },
                take: 10,
            });

            socket.emit("initial_preguntas", {
                messages: messages.map(msg => ({
                    id: msg.id,
                    message: msg.text,
                    username: msg.users?.name,
                    major: msg.users?.major,
                    date: msg.created_at,
                    image_url: msg.user_id ? `/uploads/${msg.user_id}.webp` : '/uploads/default.webp', // Usa la imagen por defecto si no hay user_id
                })),
            });
        } catch (error) {
            console.error('Error al recuperar mensajes iniciales:', error);
        }
    };

    sendInitialMessages();

    socket.on('send_pregunta', async (data) => {
        console.log("Recibido evento 'send_pregunta' con data:", data);
        const token = data.token;

        try {
            const secret = process.env.NEXTAUTH_SECRET;
            console.log("Verificando token...");
            const decoded = jwt.verify(token, secret);
            console.log("Token decodificado:", decoded);

            if (decoded) {
                const userId = decoded.id;
                const messageText = data.message;
                const imageUrl =`/uploads/${msg.user_id}.webp`

                console.log("Creando mensaje con userId:", userId, "text:", messageText, "imageUrl:", imageUrl);

                const newMessage = await prisma.messages.create({
                    data: {
                        user_id: userId,
                        text: messageText,
                        image_url: imageUrl,
                        created_at: new Date(),
                    },
                });

                console.log("Mensaje creado en la base de datos:", newMessage);

                const user = await prisma.users.findUnique({
                    where: { id: userId },
                    select: {
                        name: true,
                        major: true,
                    },
                });

                console.log("Usuario encontrado:", user);

                const formattedMessage = {
                    id: newMessage.id,
                    message: newMessage.text,
                    username: user.name,
                    major: user.major,
                    date: newMessage.created_at,
                    image_url: imageUrl, // Usar la URL generada
                };

                console.log("Emitiendo 'new_pregunta' con mensaje formateado:", formattedMessage);
                io.emit("new_pregunta", formattedMessage);
            } else {
                console.log("Token no válido. Desconectando socket.");
                socket.disconnect();
            }
        } catch (error) {
            console.error("Error al verificar token o enviar mensaje:", error);
            socket.disconnect();
        }
    });

    socket.on('load_more_preguntas', async (data) => {
        const { offset } = data;
        console.log("Recibido evento 'load_more_preguntas' con offset:", offset);

        try {
            const messages = await prisma.messages.findMany({
                include: {
                    users: {
                        select: {
                            name: true,
                            major: true,
                        },
                    },
                },
                orderBy: {
                    id: 'desc',
                },
                skip: offset,
                take: 10,
            });

            console.log("Mensajes cargados adicionales:", messages);

            const hasMore = messages.length === 10;
            console.log("¿Hay más mensajes?", hasMore);

            socket.emit("more_preguntas", {
                messages: messages.map(msg => ({
                    id: msg.id,
                    message: msg.text,
                    username: msg.users?.name,
                    major: msg.users?.major,
                    date: msg.created_at,
                    image_url: msg.user_id ? `/uploads/${msg.user_id}.webp` : '/uploads/default.webp', // Usa la imagen por defecto si no hay user_id
                })),
                has_more: hasMore,
            });

            socket.emit("more_preguntas_loaded");
        } catch (error) {
            console.error('Error al cargar más preguntas:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
};

console.log('Socket.IO configurado y escuchando');

module.exports = registerSockets;
