'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import io from 'socket.io-client';
import { useSession } from 'next-auth/react';
import ModalContext from '@/context/ModalContext';

const ChatGlobalContext = createContext();

const ChatGlobalProvider = ({ children }) => {
    const [isSending, setIsSending] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [newSocket, setSocket] = useState(null);
    const { setIsRegisterModalOpen, setIsLoged } = useContext(ModalContext);
    const { data: session } = useSession();
    const [offset, setOffset] = useState(0);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);

    useEffect(() => {
        console.log('Inicializando conexión WebSocket...');
        const socket = io(`${window.origin}`);
        setSocket(socket);

        socket.on('connect', () => {
            console.log('Conexión WebSocket establecida con el ID:', socket.id);
        });

        socket.on('connect_error', (error) => {
            console.error('Error en la conexión WebSocket:', error);
        });

        socket.on('disconnect', (reason) => {
            console.warn('WebSocket desconectado:', reason);
        });

        socket.on('initial_preguntas', (data) => {
            setMessages(data.messages.reverse());
            setOffset(data.messages.length);
        });

        socket.on('new_pregunta', (pregunta) => {
            setMessages((prevMessages) => [...prevMessages, pregunta]);
        });

        socket.on('more_preguntas', (data) => {
            if (data.messages && data.messages.length > 0) {
                setMessages((prevMessages) => [...data.messages.reverse(), ...prevMessages]);
                setOffset((prevOffset) => prevOffset + data.messages.length);
            }
            setHasMoreMessages(data.has_more);
        });

        socket.onAny((event, ...args) => {
            console.debug(`Evento recibido: ${event}`, args);
        });

        return () => {  //
            socket.close();
        };
    }, []); 

    const handleSend = () => {
        if (!newSocket || !newSocket.connected || !session) {
            console.error('No se puede enviar el mensaje: WebSocket no está conectado o no hay sesión.');
            setIsRegisterModalOpen(true);
            setIsLoged(false);
            return;
        }

        setIsSending(true);
        const accessToken = session?.user?.accessToken;

        if (!accessToken) {
            console.error('No se encontró el token para enviar.');
            setIsSending(false);
            return;
        }

        newSocket.emit('send_pregunta', {
            message: input,
            token: accessToken 
        }, (response) => {
            setInput("");
            if (response && response.error) {
                setIsRegisterModalOpen(true);
                setIsLoged(false);
                
                console.error('Error al enviar mensaje al servidor:', response.error);
            } else if (response) {
                console.log('Mensaje enviado exitosamente al chat global:', response);
            }
        });

        setIsSending(false);
    };

    const loadMoreMessages = () => {
        if (!hasMoreMessages) {
            console.log('No hay más mensajes para cargar.');
            return;
        }

        const newOffset = offset;

        if (!newSocket || !newSocket.connected) {
            console.error('No se puede cargar más mensajes: la conexión WebSocket no está establecida.');
            return;
        }

        newSocket.emit('load_more_preguntas', { offset: newOffset }, (response) => {
            if (response && Array.isArray(response.messages)) {
                if (response.messages.length > 0) {
                    setMessages((prevMessages) => [...response.messages.reverse(), ...prevMessages]);
                    setOffset((prevOffset) => prevOffset + response.messages.length);
                } else {
                    setHasMoreMessages(false);
                }
            } else if (response && response.error) {
                console.error('Error al recibir mensajes antiguos:', response.error);
            }
        });
    };

    const data = {
        messages,
        handleSend,
        input,
        setInput,
        isSending,
        loadMoreMessages,
        offset,
        hasMoreMessages,
        newSocket,
    };

    return (
        <ChatGlobalContext.Provider value={data}>
            {children}
        </ChatGlobalContext.Provider>
    );
};

export { ChatGlobalProvider };
export default ChatGlobalContext;
