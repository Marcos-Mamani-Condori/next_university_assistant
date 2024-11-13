'use client'; 

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation'; 

const InputFocusContext = createContext();

const InputFocusProvider = ({ children }) => {
    const [isInputFocused, setIsInputFocused] = useState(false);
    const inputRef = useRef(null);
    const pathname = usePathname(); 

    useEffect(() => {
        const handleFocus = () => { 
            setIsInputFocused(true);
        };
        const handleBlur = () => setIsInputFocused(false);

        const inputElement = inputRef.current;

        if (inputElement) {
            inputElement.addEventListener('focus', handleFocus);
            inputElement.addEventListener('blur', handleBlur);

            return () => {
                inputElement.removeEventListener('focus', handleFocus);
                inputElement.removeEventListener('blur', handleBlur);
            };
        }
    }, [pathname]); 

    return (
        <InputFocusContext.Provider value={{ isInputFocused, inputRef }}>
            {children}
        </InputFocusContext.Provider>
    );
};

const useInputFocus = () => useContext(InputFocusContext);

export { InputFocusProvider, useInputFocus };
export default InputFocusContext;
