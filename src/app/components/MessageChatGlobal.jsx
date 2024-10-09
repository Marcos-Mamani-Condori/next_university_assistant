'use client'
import React from "react";
import chatbot_icon from '@/app/assets/images/chatbot_icon.png';
import user_icon from '@/app/assets/images/user_icon.png';
import LikeButton from '@/app/components/LikeButton'; // Importar el nuevo componente LikeButton

function SCMessage({ text, sender, id }) {
    const isUser = sender === 'user';
    const icon = isUser
        ? <img src={user_icon} alt="User Icon" className="h-8 w-8 rounded-full" />
        : <img src={chatbot_icon} alt="Chatbot Icon" className="h-8 w-8 rounded-full" />;
    
    const { username, carrera, fecha } = sender;

    // Para obtener la hora en que se envió el mensaje
    const obtenerTiempoTranscurrido = () => {
        const fechaComentarioDate = new Date(fecha);
        const fechaActual = new Date();
        const diferenciaTiempo = fechaActual - fechaComentarioDate;
        const segundos = Math.floor(diferenciaTiempo / 1000);
        const minutos = Math.floor(segundos / 60);
        const horas = Math.floor(minutos / 60);
        const días = Math.floor(horas / 24);
        const semanas = Math.floor(días / 7);
        const meses = Math.floor(días / 30);
        const años = Math.floor(días / 365);

        if (años > 0) {
            return `hace ${años} año${años > 1 ? 's' : ''}`;
        } else if (meses > 0) {
            return `hace ${meses} mes${meses > 1 ? 'es' : ''}`;
        } else if (semanas > 0) {
            return `hace ${semanas} semana${semanas > 1 ? 's' : ''}`;
        } else if (días > 0) {
            return `hace ${días} día${días > 1 ? 's' : ''}`;
        } else if (horas > 0) {
            return `hace ${horas} hora${horas > 1 ? 's' : ''}`;
        } else if (minutos > 0) {
            return `hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
        } else {
            return `hace ${segundos} segundo${segundos > 1 ? 's' : ''}`;
        }
    };

    return (
        <div className={`flex flex-col mb-4 ${isUser ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'} rounded-lg p-4`}>
            <div className="flex items-center mb-2">
                {icon}
                <div className="ml-2">
                    <span className="font-semibold text-sm">{username}</span>
                    <span className="text-xs text-gray-500">{obtenerTiempoTranscurrido()}</span>
                    <span className="block text-xs text-gray-500">{carrera}</span>
                </div>
            </div>
            <p className="text-sm">{text}</p>
            {/* Integrar el componente LikeButton aquí */}
            <LikeButton messageId={id} username={username} />
        </div>
    );
}

export default SCMessage;
