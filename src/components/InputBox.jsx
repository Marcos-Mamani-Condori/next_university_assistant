'use client';

import React, { useContext, useEffect, useState } from "react";
import BotContext from "@/context/BotContext";
import { useInputFocus } from "@/context/InputFocusContext";
import ChatGlobalContext from "@/context/ChatGlobalContext";
import { usePathname } from 'next/navigation'; 
import ImageUploader from '@/components/ImageUploader';
import { useSession } from 'next-auth/react';
import AudioUploader from '@/components/AudioUploader';

function InputBox({ className }) {
    const { data: session } = useSession();

    const pathname = usePathname();
    const contexts = pathname === "/bot" ? BotContext : ChatGlobalContext;
    const inputSource = pathname === "/bot" ? "inputBot" : "inputChat"; 
    const { setInput, input, isSending, handleSend, setfilePath } = useContext(contexts);
    const { inputRef } = useInputFocus();

    const [filePath, setFilePath] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        if (inputRef.current && !isSending) {
            inputRef.current.focus();
        }
    }, [isSending, inputRef]);

    useEffect(() => {
        setfilePath(filePath);
        console.log("Valor de filePath pasado en input:", filePath);
    }, [filePath]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 

        if (input.trim()) {
            handleSend(input, filePath);
            setInput('');
            setFilePath('');
            setFile(null); 
        } else {
            console.log("El input está vacío, no se enviará.");
        }
    };

    return (
        <div>
            {file && (
                <div className="flex items-center mb-2">
                    {file.type.startsWith('image/') && (
                        <img src={URL.createObjectURL(file)} alt="Previsualización" className="w-16 h-16 object-cover rounded mr-2" />
                    )}
                    {file.type.startsWith('audio/') && (
                        <audio controls className="mr-2">
                            <source src={URL.createObjectURL(file)} type={file.type} />
                            Tu navegador no soporta la reproducción de este archivo de audio.
                        </audio>
                    )}
                    <span className="text-gray-700">{file.name}</span>
                </div>
            )}
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
               
                {session && session.user.role === 'premium' && pathname === '/chat' && (
                    <>
                        <ImageUploader setFilePath={setFilePath} file={file} setFile={setFile} inputSource={inputSource} />
                        <AudioUploader setFilePath={setFilePath} file={file} setFile={setFile} />
                    </>
                )}
                <button
                    type="submit"
                    disabled={isSending}
                    className={`text-white px-4 ml-2 py-2 rounded ${isSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                    Enviar
                </button>
            </form>
        </div>
    );
}

export default InputBox;
