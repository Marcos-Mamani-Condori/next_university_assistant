import React from 'react';

const DesbloqueoTareas = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white border-2 border-gray-400 rounded-lg p-6 text-center shadow-lg max-w-sm">
        {/* Icono del candado */}
        <div className="text-4xl text-gray-500 mb-4">
        
          <svg className='mx-auto w-16 h-16'
           xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M8 10V7c0-2.21 1.79-4 4-4s4 1.79 4 4v3m-4 5a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 0v3m-5.4-8h10.8c.88 0 1.6.72 1.6 1.6v7c0 1.32-1.08 2.4-2.4 2.4H7.4C6.08 21 5 19.92 5 18.6v-7c0-.88.72-1.6 1.6-1.6"/>
          </svg>
        </div>
        {/* Texto */}
        <p className="text-gray-700 text-xl font-medium">
          Desbloquea tareas <br /> y trabajos pendientes
        </p>
      </div>
    </div>
  );
};

export default DesbloqueoTareas;
