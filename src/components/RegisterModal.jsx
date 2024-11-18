'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import LoginPage from '@/app/auth/login/page';
import RegisterPage from '@/app/auth/register/page';
import ProfilePage from '@/app/auth/profile/page'; 

const RegisterModal = ({ isOpen, onClose, setIsLoged }) => {
  const { data: session } = useSession(); 
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  const toggleLoginRegister = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <>
      {session ? ( 
        <>
          <ProfilePage onClose={onClose} />
        </>
      ) : isLogin ? ( 
        <LoginPage onClose={onClose} setIsLoged={setIsLoged} toggleLoginRegister={toggleLoginRegister} />
      ) : (
        <RegisterPage onClose={onClose} setIsLoged={setIsLoged} toggleLoginRegister={toggleLoginRegister} />
      )}
    </>
  );
};

export default RegisterModal;
