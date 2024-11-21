'use client';
import React, { useEffect, useState } from 'react';

const ConnectedUsers = () => {
    const [connectedUsers, setConnectedUsers] = useState(0);

    useEffect(() => {
        const fetchConnectedUsers = async () => {
            try {
                const response = await fetch('/api/connected-users');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setConnectedUsers(data.connectedUsers);
            } catch (error) {
                console.error("Error al obtener el conteo de usuarios:", error);
            }
        };

        fetchConnectedUsers();
    }, []);

    return (
        <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <h2>{connectedUsers}</h2>
      </div>
    );
};

export default ConnectedUsers;
