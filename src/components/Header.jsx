'use client';

import { useContext } from 'react'; 
import Image from 'next/image'; 
import user_icon from '@/public/static/user_icon.png';
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
        "/": "INICIO",
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
            <div className="absolute left-1">
                {session && (
                    <div>
                         <span className="text-white">Bienvenido, {session.user.name}!</span>
                        <button className="bg-white text-black px-4 py-2 rounded-md" onClick={() => signOut()}>
                            Logout
                        </button>
                    </div>
                )}
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
