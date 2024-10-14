'use client';
import React, { useState } from 'react';
import LoginPage from '@/app/auth/login/page';
import RegisterPage from '@/app/auth/register/page';

const RegisterModal = ({ isOpen, onClose, setIsLoged }) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  const toggleLoginRegister = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <>
      {isLogin ? (
        <LoginPage onClose={onClose} setIsLoged={setIsLoged} toggleLoginRegister={toggleLoginRegister} />
      ) : (
        <RegisterPage onClose={onClose} setIsLoged={setIsLoged} toggleLoginRegister={toggleLoginRegister} />
      )}
     
    </>
  );
};

export default RegisterModal;
