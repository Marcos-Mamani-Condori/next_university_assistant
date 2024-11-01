'use client';
import React, { useContext, useEffect, useState } from "react";
import BotContext from "@/context/BotContext";
import { useInputFocus } from "@/context/InputFocusContext";
import ChatGlobalContext from "@/context/ChatGlobalContext";
import { usePathname } from 'next/navigation'; 
import { useSession } from 'next-auth/react'; // Importar useSession
import LikeButton from '@/components/LikeButton'; // Asegúrate de que este componente esté importado si es necesario

function InputBox({ className }) {
    const pathname = usePathname();
    const contexts = pathname === "/bot" ? BotContext : ChatGlobalContext;
    const source = pathname === "/bot" ? "inputbot" : "inputchat";
    const { setInput, input, isSending, handleSend } = useContext(contexts);
    const { inputRef } = useInputFocus();

    const [shouldFocus, setShouldFocus] = useState(false);
    const { data: session } = useSession(); // Obtener la sesión
    const [file, setFile] = useState(null); // Estado para manejar el archivo

    useEffect(() => {
        if (shouldFocus && inputRef.current && !isSending) {
            inputRef.current.focus();
            setShouldFocus(false);
        }
    }, [shouldFocus, isSending, inputRef]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) {
                handleSubmit(e); // Enviar el formulario al presionar Enter
            }
            setShouldFocus(true);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Guardar el archivo seleccionado
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        if (input.trim()) {
            handleSend(); 
            if (source === 'inputchat' && file) {
                await handleUpload(); // Llamar a la función para subir la imagen
            }
            setInput(''); 
            setFile(null); // Limpiar el archivo después de enviar
        }
        setShouldFocus(true);
    };

    const handleUpload = async () => {
        if (!file) {
            console.error('No file selected.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.user.accessToken}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Imagen subida correctamente:', data);
            } else {
                console.error('Error al subir la imagen:', data.error);
            }
        } catch (error) {
            console.error('Error al subir la imagen:', error);
        }
    };

    return (
        <form className={`${className} flex items-center justify-center`} onSubmit={handleSubmit}>
            <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                placeholder={isSending ? "Esperando respuesta..." : "Escribe un mensaje..."}
                disabled={isSending}
                rows={1}
                className="flex-1 px-4 py-2 border border-gray-600 rounded focus:outline-none focus:ring focus:border-blue-300 resize-none"
            />
            <input 
                type="file" 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" // Ocultar el input de archivo
                id="file-upload" // ID para acceder al input en el botón
            />
            <label htmlFor="file-upload" className="cursor-pointer text-blue-500 hover:underline">
                Seleccionar imagen
            </label>
            <button
                type="submit"
                disabled={isSending}
                className={`text-white px-4 ml-2 py-2 rounded ${isSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
                Enviar
            </button>
        </form>
    );
}

export default InputBox;
