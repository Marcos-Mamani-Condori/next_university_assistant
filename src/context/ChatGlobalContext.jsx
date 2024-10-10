'use client'; // Asegúrate de agregar esta línea para que el contexto se pueda utilizar en 

import React, { useEffect, useState, createContext, useContext } from 'react';
import io from 'socket.io-client';
import ModalContext from '@/context/ModalContext';

const ChatGlobalContext = createContext();

const ChatGlobalProvider = ({ children }) => {
    const [isSending, setIsSending] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [newSocket, setSocket] = useState(null);
    const {setIsRegisterModalOpen, setIsLoged } = useContext(ModalContext);
    const [offset, setOffset] = useState(0);
    const [hasMoreMessages, setHasMoreMessages] = useState(true); // Nuevo estado

    useEffect(() => {
        console.log('Inicializando conexión WebSocket...');
        const newSocket = io(`${window.origin}`);

        setSocket(newSocket);

        // Evento 'connect' para cuando la conexión se establece correctamente
        newSocket.on('connect', () => {
            console.log('Conexión WebSocket establecida con el ID:', newSocket.id);
        });

        // Evento 'connect_error' para manejar errores durante la conexión
        newSocket.on('connect_error', (error) => {
            console.error('Error en la conexión WebSocket:', error);
        });

        // Evento 'disconnect' para cuando la conexión se pierde
        newSocket.on('disconnect', (reason) => {
            console.warn('WebSocket desconectado:', reason);
        });

        // Escuchar preguntas iniciales
        newSocket.on('initial_preguntas', (data) => {
            console.log('Recibido evento initial_preguntas:', data);
            setMessages(data.messages.reverse()); // Mensajes más recientes al final
            setOffset(data.messages.length); // Establecer offset inicial
        });

        newSocket.on('new_pregunta', (pregunta) => {
            console.log('Recibido evento new_preguntas:', pregunta);
            setMessages((prevMessages) => [...prevMessages, pregunta]); // Agregar nuevo mensaje al final
            
            // Actualizar el offset para reflejar el nuevo mensaje
            setOffset((prevOffset) => prevOffset + 1);
        });

        // Escuchar más preguntas
        newSocket.on('more_preguntas', (data) => {
            console.log('Recibido evento more_preguntas:', data);
            
            // Asegurarte de que hay mensajes antes de actualizar el estado
            if (data.messages && data.messages.length > 0) {
                setMessages((prevMessages) => [...data.messages.reverse(), ...prevMessages]); // Agregar mensajes antiguos al principio
                setOffset((prevOffset) => prevOffset + data.messages.length); // Actualizar offset después de agregar los mensajes
            }

            // Actualizar el estado de hasMoreMessages según el valor recibido
            setHasMoreMessages(data.has_more);
        });

        // Evento genérico para capturar todos los eventos
        newSocket.onAny((event, ...args) => {
            console.debug(`Evento recibido: ${event}`, args);
        });

        return () => {
            console.log('Cerrando conexión WebSocket...');
            newSocket.close();
        };
    }, []); // Nota: Dependencias vacías, esto se ejecuta solo una vez

    const handleSend = () => {
        if (!newSocket || !newSocket.connected) {
            console.error('No se puede enviar el mensaje: la conexión WebSocket no está establecida.');
            return;
        }

        setIsSending(true);
        const token = localStorage.getItem('token'); // Asegúrate de guardar el token en el login
        console.log("Preparando para enviar mensaje:", { input, token });

        // Emitir el mensaje
        newSocket.emit('send_pregunta', { message: input, token }, (response) => {
            console.log('Emit ejecutado. Esperando respuesta del servidor...');
            setInput("");
            if (response && response.error) {
                setIsRegisterModalOpen(true);
                setIsLoged(true);
                console.error('Error al enviar mensaje al servidor:', response.error);
            } else if (response) {
                console.log('Mensaje enviado exitosamente al chat global:', response);
            } else {
                console.warn('No se recibió ninguna respuesta del servidor después del emit.');
            }
        });

        setIsSending(false);
    };

    // Función para cargar más mensajes antiguos
    const loadMoreMessages = () => {
        if (!hasMoreMessages) {
            console.log('No hay más mensajes para cargar.');
            return;
        }
    
        const newOffset = offset; // No incrementar offset aquí
    
        if (!newSocket || !newSocket.connected) {
            console.error('No se puede cargar más mensajes: la conexión WebSocket no está establecida.');
            return;
        }
    
        newSocket.emit('load_more_preguntas', { offset: newOffset }, (response) => {
            console.log('Cargando antiguos mensajes', response);
    
            if (response && Array.isArray(response.messages)) {
                console.log('Mensajes recibidos:', response.messages);
                if (response.messages.length > 0) {
                    setMessages((prevMessages) => [...response.messages.reverse(), ...prevMessages]); // Agregar mensajes antiguos al principio
                    setOffset((prevOffset) => prevOffset + response.messages.length); // Actualizar offset después de agregar los mensajes
                } else {
                    console.warn('No se recibieron nuevos mensajes para agregar.');
                    setHasMoreMessages(false); // Desactivar la carga si no hay más mensajes
                }
            } else if (response && response.error) {
                console.error('Error al recibir mensajes antiguos:', response.error);
            } 
        });
    };

    const data = { messages, handleSend, input, setInput, isSending, loadMoreMessages, offset, hasMoreMessages, newSocket };
   
    return (
        <ChatGlobalContext.Provider value={data}>
            {children}
        </ChatGlobalContext.Provider>
    );
};

export { ChatGlobalProvider };
export default ChatGlobalContext;
