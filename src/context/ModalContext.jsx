'use client'; 

import React, { useState, createContext, useEffect } from 'react';

const ModalContext = createContext();

const ModalProvider = ({ children }) => {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isLoged, setIsLoged] = useState(false);
    useEffect(() => {
        console.log('ModalProvider montado');
        return () => {
            console.log('ModalProvider desmontado');
        };
    }, []);

    const data = { isRegisterModalOpen, setIsRegisterModalOpen, isLoged, setIsLoged };

    return (
        <ModalContext.Provider value={data}>
            {children}
        </ModalContext.Provider>
    );
};

export { ModalProvider };
export default ModalContext;
