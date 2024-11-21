'use client';

import { useContext, useState } from 'react';
import Image from 'next/image';
import bell_icon from '@/public/static/bell_icon.svg';
import RegisterModal from '@/components/RegisterModal';
import { usePathname } from 'next/navigation';
import ModalContext from '@/context/ModalContext';
import UserImage from '@/components/UserImage';

const Header = ({ className }) => {
    const { isRegisterModalOpen, setIsRegisterModalOpen, setIsLoged } = useContext(ModalContext);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const handleRegisterClick = () => {
        setIsLoged(false);
        setIsRegisterModalOpen(true);
    };

    const handleCloseRegisterModal = () => {
        setIsRegisterModalOpen(false);
    };

    const toggleNotificationBox = () => {
        setIsNotificationOpen(!isNotificationOpen);
    };

    const pathname = usePathname();
    const pageTitles = {
        "/": "LoyoApp",
        "/chat": "LoyoChat",
        "/bot": "LoyoBot",
    };
    const currentTitle = pageTitles[pathname] || "LoyoApp";

    return (
        <header className={`${className} h-full overflow-hidden flex items-center justify-center relative  border border-gray-400`}>
            <div className="absolute left-4"></div>
            <div className="text-center">
                <h1 className="text-2xl font-bold text-white">{currentTitle}</h1>
            </div>
            <div className="absolute right-4 flex items-center space-x-4 sm:right-10 md:right-30">


                <button onClick={handleRegisterClick}>
                    <UserImage />
                </button>


                <button onClick={toggleNotificationBox}>
                    <Image
                        src={bell_icon}
                        alt="Notification bell icon"
                        width={32}
                        height={32}
                        className="h-8 w-8"
                        loading="eager"
                    />
                </button>
                {isNotificationOpen && (
                    <div className="absolute top-10 right-0 w-48 p-4 bg-white border border-gray-300 rounded shadow-lg">
                        <p className="text-gray-700">No new notifications</p>
                    </div>
                )}
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
