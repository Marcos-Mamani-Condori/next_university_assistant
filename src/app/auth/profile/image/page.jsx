'use client'; // Habilitar el modo cliente para usar hooks
import { useState } from 'react';
import { useSession } from "next-auth/react";

const UploadPage = () => {
  const { data: session } = useSession(); // Obtener la sesión actual
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  // Obtener el token de acceso
  const accessToken = session?.user?.accessToken;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Por favor, selecciona un archivo.');
      return;
    }

    if (!accessToken) {
      setMessage('No se encontró el token de acceso.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`, // Enviar el token en el encabezado
        },
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
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">
          Subir
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default UploadPage;
