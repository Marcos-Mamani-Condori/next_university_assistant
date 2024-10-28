import React from 'react';

const NotificationModal = ({ message, details, onClose }) => {
    return (
        <div 
            className="fixed inset-0 z-50 flex items-start justify-end"
            onClick={onClose} // Cierra el modal al hacer clic en el fondo
        >
            <div
                className="relative bg-white rounded-lg shadow-lg p-4 w-72 border border-gray-200 m-4"
                onClick={(e) => e.stopPropagation()} // Evita que el clic dentro cierre el modal
            >
                <h2 className="text-lg font-semibold mb-1">Notificaciónes</h2>
                <p className="text-gray-700 mb-2">{message}</p>
                {details && <p className="text-gray-500 text-sm">{details}</p>}
            </div>
        </div>
    );
}; 

export default NotificationModal;
