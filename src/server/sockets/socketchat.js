const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const prisma = require('./../../libs/db');

const registerSockets = (io) => { // Cambiar 'httpServer' por 'io'
    io.on('connection', (socket) => {
        const sendInitialMessages = async () => {
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
                    take: 10,
                });

                socket.emit("initial_preguntas", {
                    messages: messages.map(msg => ({
                        id: msg.id,
                        message: msg.text,
                        username: msg.users?.name,
                        major: msg.users?.major,
                        date: msg.date,
                    })),
                });
            } catch (error) {
                console.error('Error al recuperar mensajes iniciales:', error);
            }
        };

        sendInitialMessages();

        socket.on('send_pregunta', async (data) => {
            const token = data.token;

            try {
                const secret = process.env.NEXTAUTH_SECRET;
                const decoded = jwt.verify(token, secret);

                if (decoded) {
                    const userId = decoded.id;
                    const messageText = data.message;

                    const newMessage = await prisma.messages.create({
                        data: {
                            user_id: userId,
                            text: messageText,
                            date: new Date(),
                        },
                    });

                    const user = await prisma.users.findUnique({
                        where: {
                            id: userId,
                        },
                        select: {
                            name: true,
                            major: true,
                        },
                    });

                    const formattedMessage = {
                        id: newMessage.id,
                        message: newMessage.text,
                        username: user.name,
                        major: user.major ,
                        date: newMessage.date,
                    };

                    io.emit("new_pregunta", formattedMessage);
                } else {
                    socket.disconnect();
                }
            } catch (error) {
                socket.disconnect();
            }
        });

        socket.on('load_more_preguntas', async (data) => {
            const { offset } = data;

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

                const hasMore = messages.length === 10;

                socket.emit("more_preguntas", {
                    messages: messages.map(msg => ({
                        id: msg.id,
                        message: msg.text,
                        username: msg.users?.name ,
                        major: msg.users?.major ,
                        date: msg.date,
                    })),
                    has_more: hasMore,
                });
            } catch (error) {
                console.error('Error al cargar más preguntas:', error);
            }
        });

        socket.on('disconnect', () => {});

    });

    console.log('Socket.IO configurado y escuchando');
};

module.exports = registerSockets;
