'use client'
import React, { useState, useContext } from 'react';
import ModalContext from '@/context/ModalContext';
import Warning from '@/components/warning';

const RegisterModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [carrera, setCarrera] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  // Desestructuración del contexto
  const { isLoged, setIsLoged } = useContext(ModalContext);

  const carreras = [
    'Adm. Empresas',
    'Ing. Comercial',
    'Ing. Financiera',
    'Derecho',
    'Comunicación',
    'Ing. Civil',
    'Ing. Industrial',
    'Ing. Sistemas',
    'Ing. Mecánica',
    'Ing. Electrónica',
    'Ing. Ambiental',
    'Gastronomía',
    'Veterinaria',
  ];

  const clearInputs = () => {
    setUsername('');
    setPassword('');
    setCarrera('');
  };

  const handleRegister = async () => {
    const response = await fetch('register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, carrera }),
    });

    if (response.ok) {
      alert('Usuario registrado correctamente');
      clearInputs();
      onClose();
    } else {
      alert('Error al registrar el usuario');
      clearInputs();
    }
  };

  const handleLogin = async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      alert('Logeo exitoso');
      clearInputs();
      onClose();
    } else {
      alert('El usuario ya existe o la contraseña es incorrecta');
      clearInputs();
    }
  };

  if (isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => {
        onClose();
        clearInputs();
      }}
    >
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-96"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <button
          className="text-gray-500 hover:text-gray-700 float-right text-2xl"
          onClick={() => {
            onClose();
            clearInputs();
          }}
        >
          ×
        </button>
        <h2 className="text-2xl font-semibold text-center mb-4">
          {isLogin ? 'Iniciar Sesión' : 'Registro'}
        </h2>
        <input
          type="text"
          placeholder="Nombre de Usuario"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {!isLogin && (
          <select
            value={carrera}
            onChange={(e) => {
              setCarrera(e.target.value);
            }}
            className="w-full p-3 mb-4 border rounded-md bg-gray-100 text-gray-700"
          >
            <option value="" disabled>
              Selecciona tu carrera
            </option>
            {carreras.map((carrera, index) => (
              <option key={index} value={carrera}>
                {carrera}
              </option>
            ))}
          </select>
        )}
        <input
          type="password"
          placeholder="Código Universitario"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={isLogin ? handleLogin : handleRegister}
          className="w-full p-3 mb-4 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </button>
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            clearInputs();
          }}
          className="w-full p-3 text-blue-600 hover:text-blue-700"
        >
          {isLogin
            ? '¿No tienes cuenta? Regístrate'
            : '¿Ya tienes cuenta? Inicia Sesión'}
        </button>
        {isLoged && (
          <Warning message="Necesitas estar registrado para usar el chat global" />
        )}
      </div>
    </div>
  );
};

export default RegisterModal;
