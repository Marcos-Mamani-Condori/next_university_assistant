'use client';

import React, { useContext, useEffect, useState } from "react";
import BotContext from "@/context/BotContext";
import { useInputFocus } from "@/context/InputFocusContext";
import ChatGlobalContext from "@/context/ChatGlobalContext";
import { usePathname } from 'next/navigation'; 
import { useSession } from 'next-auth/react'; 

function InputBox({ className }) {
    const pathname = usePathname();
    const contexts = pathname === "/bot" ? BotContext : ChatGlobalContext;
    const { setInput, input, isSending, handleSend, setfilePath } = useContext(contexts);
    const { inputRef } = useInputFocus();

    const [shouldFocus, setShouldFocus] = useState(false);
    const { data: session } = useSession();
    const [file, setFile] = useState(null);
    const [filePath, setFilePath] = useState(''); // Estado para la ruta del archivo

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
                handleSubmit(e);
            }
        }
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            console.log("Archivo seleccionado:", selectedFile);
            const uploadedFilePath = await handleUpload(selectedFile);
            if (uploadedFilePath) {
                console.log("Ruta del archivo devuelta:", uploadedFilePath);
                setfilePath(uploadedFilePath); // Establecer la ruta en el contexto
                setFilePath(uploadedFilePath); // Actualizar el estado de filePath para la previsualización
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        console.log("Enviando input:", input);
        console.log("Estado actual del archivo:", file);

        if (input.trim()) {
            console.log("Enviando mensaje con la ruta de archivo:", filePath);
            handleSend(input, filePath); // Usar filePath aquí
            console.log("Mensaje enviado:", { text: input, img: filePath });
            setInput(''); 
            setFile(null);
            setFilePath(''); // Limpiar el filePath después de enviar
            setShouldFocus(true);
        } else {
            console.log("El input está vacío, no se enviará.");
        }
    };

    const handleUpload = async (selectedFile) => {
        if (!selectedFile) {
            console.error('No se ha seleccionado ningún archivo.');
            return null;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);
        console.log('Preparando para subir el archivo:', selectedFile);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.user?.accessToken}`, 
                },
                body: formData,
            });

            console.log("Respuesta de la carga:", response);
            const data = await response.json();
            console.log("Datos recibidos de la carga:", data);
            if (response.ok) {
                console.log('Imagen subida correctamente:', data);
                console.log('Ruta de archivo recibida:', data.filePath);
                return data.filePath; 
            } else {
                console.error('Error al subir la imagen:', data.error);
                return null;
            }
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            return null;
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
                className="hidden"
                id="file-upload"
            />
            <button
                type="button"
                className={`text-white px-4 ml-2 py-2 rounded ${isSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                onClick={() => document.getElementById('file-upload').click()} // Abrir el selector de archivos
            >
                Seleccionar imagen
            </button>
            <button
                type="submit"
                disabled={isSending}
                className={`text-white px-4 ml-2 py-2 rounded ${isSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
                Enviar
            </button>
            {filePath && (
                <div className="flex items-center ml-2">
                    <img src={filePath} alt="Previsualización" className="w-16 h-16 object-cover rounded" />
                    <span className="ml-2">{file.name}</span> {/* Mostrar el nombre del archivo */}
                </div>
            )}
        </form>
    );
}

export default InputBox;
