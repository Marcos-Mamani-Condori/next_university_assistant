// NotificationIcon.js
'use client';

import React, { useState, useContext } from 'react';
import NotificationContext from '@/context/NotificationContext';
import NotificationModal from './NotificationModal';
import Image from 'next/image'; // Importa Image
import bell_icon from '@/public/static/bell_icon.svg'; // Importa el ícono personalizado

const NotificationIcon = () => {
    const { unreadCount } = useContext(NotificationContext);
    console.log('unreadCount:', unreadCount);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleIconClick = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="relative cursor-pointer" onClick={handleIconClick}>
                <Image 
                    src={bell_icon}
                    alt="Bell icon" 
                    width={32} 
                    height={32}
                    className="h-8 w-8"
                />
                {/* Indicador de notificaciones no leídas */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -left-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </div>
            {isModalOpen && <NotificationModal onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

export default NotificationIcon;
