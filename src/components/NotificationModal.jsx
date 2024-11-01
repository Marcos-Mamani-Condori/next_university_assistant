// NotificationModal.js
'use client';

import React, { useContext } from 'react';
import NotificationContext from '@/context/NotificationContext';
import NotificationBox from './NotificationBox';

const NotificationModal = ({ onClose }) => {
    const { notifications, markAllAsRead } = useContext(NotificationContext);

    const handleModalClose = () => {
        markAllAsRead(); // Marca todas como leídas
        onClose();       // Cierra el modal
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-start justify-end"
            onClick={handleModalClose}
        >
            <div
                className="relative bg-white rounded-lg shadow-lg p-4 w-72 border border-gray-200 m-4 h-96 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold mb-1">Notificaciones</h2>
                {notifications.length === 0 ? (
                    <p className="text-gray-500 text-sm">No tienes notificaciones nuevas.</p>
                ) : (
                    notifications.map((notification, index) => (
                        <NotificationBox key={index} notification={notification} />
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationModal;
