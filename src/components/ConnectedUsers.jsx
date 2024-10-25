import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const ConnectedUsers = () => {
    const [connectedUsers, setConnectedUsers] = useState(0);
    const socket = React.useRef(null); // Usar useRef para evitar recrear la conexión

    useEffect(() => {
        // Crear la conexión al socket
        socket.current = io('http://localhost:3000'); // Cambia la URL según tu entorno

        // Escuchar el evento 'user_count'
        socket.current.on('user_count', (count) => {
            setConnectedUsers(count);
        });

        // Limpiar la conexión cuando el componente se desmonte
        return () => {
            socket.current.disconnect();
        };
    }, []); // Ejecutar solo al montar el componente

    return (
        <div>
            <h2>Usuarios conectados: {connectedUsers}</h2>
        </div>
    );
};

export default ConnectedUsers;
