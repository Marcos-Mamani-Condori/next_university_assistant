'use client'; // Asegúrate de agregar esta línea para que el contexto se ejecute en el lado del cliente.

import React, { useState, createContext } from 'react';

const ModalContext = createContext();

const ModalProvider = ({ children }) => {
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isLoged, setIsLoged] = useState(false);

    const data = { isRegisterModalOpen, setIsRegisterModalOpen, isLoged, setIsLoged };

    return (
        <ModalContext.Provider value={data}>
            {children}
        </ModalContext.Provider>
    );
};

export { ModalProvider };
export default ModalContext;
