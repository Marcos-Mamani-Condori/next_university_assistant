'use client';
import React, { useContext, useEffect, useState } from "react";
import BotContext from "@/context/BotContext";
import { useInputFocus } from "@/context/InputFocusContext";
import ChatGlobalContext from "@/context/ChatGlobalContext";
import { usePathname } from 'next/navigation'; // Cambiado a usePathname

function InputBox({ className }) {
    const pathname = usePathname(); // Obtiene la ruta actual
    const contexts = pathname === "/bot" ? BotContext : ChatGlobalContext;

    const { setInput, input, isSending, handleSend } = useContext(contexts);
    const { inputRef } = useInputFocus();

    const [shouldFocus, setShouldFocus] = useState(false);

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
                handleSend(); // Envía el mensaje solo si hay contenido
            }
            setShouldFocus(true);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Previene el comportamiento predeterminado del formulario
        if (input.trim()) {
            handleSend(); // Envía el mensaje solo si hay contenido
        }
        setShouldFocus(true);
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
