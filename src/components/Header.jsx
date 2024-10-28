import { useContext } from 'react';
import Image from 'next/image';
import user_icon from '@/public/static/user_icon.svg';
import bell_icon from '@/public/static/bell_icon.svg';
import RegisterModal from '@/components/RegisterModal';
import NotificationModal from '@/components/NotificationModal'; // Asegúrate de importar el modal
import { usePathname } from 'next/navigation';
import ModalContext from '@/context/ModalContext';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';

const Header = ({ className }) => {
    const { isRegisterModalOpen, setIsRegisterModalOpen, setIsLoged } = useContext(ModalContext);
    const { data: session } = useSession();
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false); // Estado para el modal de notificaciones

    const handleRegisterClick = () => {
        setIsLoged(false);
        setIsRegisterModalOpen(true);
    };

    const handleCloseRegisterModal = () => {
        setIsRegisterModalOpen(false);
    };

    const handleNotificationClick = () => {
        setIsNotificationModalOpen(!isNotificationModalOpen); // Alterna el estado del modal de notificaciones
    };

    const handleCloseNotificationModal = () => {
        setIsNotificationModalOpen(false); // Cierra el modal de notificaciones
    };

    const pathname = usePathname();
    const pageTitles = {
        "/": "LoyoApp",
        "/chat": "LoyoChat",
        "/bot": "LoyoBot",
    };
    const currentTitle = pageTitles[pathname] || "LoyoApp";

    return (
        <header className={`${className} h-full overflow-hidden flex items-center justify-center relative`}>
            <div className="absolute left-0 w-full pl-4">
                <h1 className="text-2xl font-bold">{currentTitle}</h1>
            </div>

            <div className="absolute left-1 hidden lg:block">
                {session && (
                    <div>
                        <span className="text-white px-3">Bienvenidos, {session.user.name}!</span>
                        <button className="bg-white text-black px-4 py-2 rounded-md" onClick={() => signOut()}>
                            Cerrar Sesión
                        </button>
                    </div>
                )}
            </div>

            <div className="absolute right-4 md:right-10 flex space-x-4"> {/* Agrupamos los botones con 'flex space-x-4' */}
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
                <button onClick={handleNotificationClick}>
                    <Image
                        src={bell_icon}
                        alt="Bell icon"
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
            {isNotificationModalOpen && (
                <NotificationModal
                    message="Tienes nuevas notificaciones"
                    details="Revisa tus mensajes recientes."
                    onClose={handleCloseNotificationModal}
                />
            )}
        </header>
    );
};

export default Header;
