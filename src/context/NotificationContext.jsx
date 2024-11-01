// NotificationContext.js
'use client';

import React, { createContext, useEffect, useState, useRef, useContext } from 'react';
import getSocket from '@/libs/socket';
import { useSession } from 'next-auth/react'; // Importar useSession
import ModalContext from './ModalContext'; // Importar ModalContext

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const socketRef = useRef(getSocket());
    const { data: session } = useSession(); // Obtener la sesión
    const { isLoged, setIsLoged } = useContext(ModalContext); // Obtener isLoged de ModalContext

    useEffect(() => {
        const socket = socketRef.current;

        // Emisión de solicitud inicial de notificaciones
        if (isLoged && session?.user?.token) { // Asegúrate de que haya un token
            socket.emit('request_initial_notifications', { token: session.user.token }); // Enviar el token
        }

        socket.on('initial_notifications', (data) => {
            setNotifications(data.notifications);
            setUnreadCount(data.notifications.length);
        });

        socket.on('new_notification', (notification) => {
            setNotifications((prev) => [notification, ...prev]);
            setUnreadCount((prevCount) => prevCount + 1);
        });

        return () => {
            socket.off('initial_notifications');
            socket.off('new_notification');
        };
    }, [isLoged, session]); // Mantener session como dependencia

    const markAllAsRead = () => setUnreadCount(0);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export { NotificationProvider };
export default NotificationContext;
