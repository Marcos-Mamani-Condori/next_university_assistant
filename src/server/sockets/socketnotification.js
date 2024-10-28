// socketnotification.js
const socket = new WebSocket('ws://tu-servidor.com/socket'); // Cambia a la URL de tu servidor

const SocketNotification = {
    connect: (onMessage) => {
        socket.onopen = () => {
            console.log('Conectado al servidor de notificaciones');
        };

        socket.onmessage = (event) => {
            const notification = JSON.parse(event.data);
            onMessage(notification); // Llama a la función callback con la notificación recibida
        };

        socket.onclose = () => {
            console.log('Desconectado del servidor de notificaciones');
        };

        socket.onerror = (error) => {
            console.error('Error en el WebSocket:', error);
        };
    },

    sendNotification: (message) => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(message));
        } else {
            console.error('No se puede enviar, WebSocket no está abierto');
        }
    },
};

export default SocketNotification;
