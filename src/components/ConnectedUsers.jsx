import React, { useEffect, useState } from 'react';
import getSocket from '@/libs/socket'; // Asegúrate de que la ruta sea correcta

const ConnectedUsers = () => {
    const [connectedUsers, setConnectedUsers] = useState(0);

    useEffect(() => {
        const socket = getSocket(); // Obtiene la instancia del socket

        // Escuchar el evento 'user_count'
        const handleUserCount = (count) => {
            console.log('Usuarios conectados:', count); // Log para depuración
            setConnectedUsers(count);
        };

        // Escuchar el evento 'user_count' para actualizaciones en tiempo real
        socket.on('user_count', handleUserCount);

        // Emitir el conteo inicial cuando se conecta
        socket.emit('request_user_count');

      
    }, []); // La dependencia está vacía para ejecutar solo al montar

    return (
        <div>
            <h2>Usuarios conectados: {connectedUsers}</h2>
        </div>
    );
};

export default ConnectedUsers;
