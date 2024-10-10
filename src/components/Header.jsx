'use client';

import { useContext, useEffect } from 'react';
import Image from 'next/image'; 
import user_icon from '@/public/static/user_icon.png';
import RegisterModal from '@/components/RegisterModal';
import { usePathname } from 'next/navigation'; 
import ModalContext from '@/context/ModalContext';

const Header = ({ className }) => {
    const { isRegisterModalOpen, setIsRegisterModalOpen, setIsLoged } = useContext(ModalContext);

    useEffect(() => {
    }, [isRegisterModalOpen]);

    const handleRegisterClick = () => {
        setIsLoged(false);
        setIsRegisterModalOpen(true);
    };

    const handleCloseRegisterModal = () => {
        setIsRegisterModalOpen(false);
    };

    const pathname = usePathname();
    const pageTitles = {
        "/": "HOME",
        "/chat": "LOYOCHAT",
        "/bot": "LOYOBOT",
    };
    const currentTitle = pageTitles[pathname] || "LoyoApp";

    return (
        <header className={`${className} h-full bg-gray-800 overflow-hidden flex items-center justify-center relative`}>
            <div className="absolute left-4"></div>
            <div className="text-center">
                <h1 className="text-2xl font-bold text-white">{currentTitle}</h1>
            </div>
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

            {isRegisterModalOpen && (
                <>
                    <RegisterModal onClose={handleCloseRegisterModal} />
                </>
            )}
        </header>
    );
};

export default Header;
