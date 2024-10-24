'use client';

import { useContext } from 'react';
import Image from 'next/image';
import user_icon from '@/public/static/user_icon.png';
import bell_icon from '@/public/static/bell_icon.svg';
import RegisterModal from '@/components/RegisterModal';
import { usePathname } from 'next/navigation';
import ModalContext from '@/context/ModalContext';
import { signOut, useSession } from 'next-auth/react';

const Header = ({ className }) => {
    const { isRegisterModalOpen, setIsRegisterModalOpen, setIsLoged } = useContext(ModalContext);
    const { data: session } = useSession();

    const handleRegisterClick = () => {
        setIsLoged(false);
        setIsRegisterModalOpen(true);
    };

    const handleCloseRegisterModal = () => {
        setIsRegisterModalOpen(false);
    };

    const pathname = usePathname();
    const pageTitles = {
        "/": "Inicio",
        "/chat": "LoyoChat",
        "/bot": "LoyoBot",
    };
    const currentTitle = pageTitles[pathname] || "LoyoApp";

    return (
        <header className={`${className} h-full bg-gray-800 overflow-hidden flex items-center justify-center relative`}>
            <div className="absolute left-4"></div>
            <div className="text-center">
                <h1 className="text-2xl font-bold text-white">{currentTitle}</h1>
            </div>

            {/* Solo aparece esta seccion cuando estas en modo escritorio, por temas de diseño */}
            <div className="absolute left-1 hidden lg:block">
                {session && (
                    <div>
                        <span className="text-white px-3">Bienvenido, {session.user.name}!</span>
                        <button className="bg-white text-black px-4 py-2 rounded-md" onClick={() => signOut()}>
                            Cerrar Sesión
                        </button>
                    </div>
                )}
            </div>
            {/* Hasta aqui es del diseño, hasta el momento por salvar walcover */}

            <div className="absolute right-4 md:right-10">
                <button onClick={handleRegisterClick}>
                    <Image
                        src={user_icon}
                        alt="User icon"
                        width={32}
                        height={32}
                        className="h-8 w-8"
                        loading="eager"
                    />
                </button>
            </div>
            <div className="absolute right-8 md:right-20"> 
                <button onClick={handleRegisterClick}>
                    <Image 
                        src={bell_icon} 
                        alt="one bell icon" 
                        width={32} 
                        height={32} 
                        className="h-8 w-8" 
                        loading="eager"
                    /> 
                </button>
            </div>

            {isRegisterModalOpen && (
                <RegisterModal
                    isOpen={isRegisterModalOpen}
                    onClose={handleCloseRegisterModal}
                    setIsLoged={setIsLoged}
                />
            )}
        </header>
    );
};

export default Header;
