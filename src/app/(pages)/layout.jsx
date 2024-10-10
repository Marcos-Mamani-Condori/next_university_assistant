'use client'; 
import React, { useEffect} from 'react';
const useDisableScrollOnMobile = () => {
  useEffect(() => {
    // Verificar si estamos en el lado del cliente
    if (typeof window !== 'undefined') {
      const isMobile = /Mobi|Android/i.test(window.navigator.userAgent);

      if (isMobile) {
        // Bloquear scroll
        document.body.style.overflow = 'hidden';
      }

      // Restaurar scroll al desmontar
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, []);
};

const Layout = ({ children }) => {
  useDisableScrollOnMobile();

  return (
    <div className='mx-2 md:mx-10 lg:mx-[10rem] grid grid-rows-10 col-span-12 row-span-10'>
          {children}
    </div>
  );
};

export default Layout;
