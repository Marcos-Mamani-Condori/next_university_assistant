'use client'; // Habilitar el modo cliente para usar hooks

import { useState } from 'react';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Por favor, selecciona un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file); // Cambiado a 'image' para coincidir con el backend

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(`Imagen subida y comprimida: ${data.filePath}`);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      setMessage('Error al subir la imagen.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Subir Imagen de Perfil</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">
          Subir
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default UploadPage;
