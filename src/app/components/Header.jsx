'use client';

import React, { useContext } from 'react';
import Image from 'next/image'; // Next.js usa Image para optimizar imágenes
import user_icon from '@/app/assets/images/user_icon.png';
import RegisterModal from '@/app/components/RegisterModal'
import { usePathname } from 'next/navigation'; // Reemplazo de useLocation
import ModalContext from '@/app/context/ModalContext';

const Header = ({ className }) => {
    const { isRegisterModalOpen, setIsRegisterModalOpen, setIsLoged } = useContext(ModalContext);

    const handleRegisterClick = () => {
        console.log('Register button clicked');
        setIsLoged(false);
        setIsRegisterModalOpen(true);
    };

    const handleCloseRegisterModal = () => {
        setIsRegisterModalOpen(false);
    };

    const pathname = usePathname(); // Obtiene la ruta actual en Next.js
    // Mapea las rutas a los nombres que quieras mostrar
    const pageTitles = {
        "/": "HOME",
        "/Chat": "LOYOCHAT",
        "/bot": "LOYOBOT",
    };

    // Obtén el título basado en la ruta actual
    const currentTitle = pageTitles[pathname] || "LoyoApp"; // Título por defecto

    return (
        <header className={`${className} h-full bg-gray-800 overflow-hidden flex items-center justify-center relative`}>
            <div className="absolute left-4">
                {/* Si tienes algún contenido adicional en la parte izquierda */}
            </div>

            <div className="text-center">
                <h1 className="text-2xl font-bold text-white">{currentTitle}</h1>
            </div>

            <div className="absolute right-4 md:right-10"> 
                <button onClick={handleRegisterClick}>
                    <Image src={user_icon} alt="User icon" className="h-8 w-8" /> 
                </button>
            </div>

            {isRegisterModalOpen && (
                <RegisterModal onClose={handleCloseRegisterModal} />
            )}
        </header>
    );
};

export default Header;
