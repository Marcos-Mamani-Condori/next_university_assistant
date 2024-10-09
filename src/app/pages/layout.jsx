'use client'; 
import React, { useEffect } from 'react';
import Header from '@/app/components/header';
import NavBar from '@/app/components/navbar';
import ProvidersContext from '@/app/context/ProvidersContext';

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
    <div className='grid grid-cols-12 grid-rows-10 w-full h-full fixed overflow-hidden'>
      <ProvidersContext>
        <Header className={"col-span-12 row-span-1"} />
          {children}
        <NavBar className={"col-span-12 row-span-1"} />
      </ProvidersContext>
    </div>
  );
};

export default Layout;
