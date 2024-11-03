'use client';
import React from "react";
import { useSession } from 'next-auth/react';

const ImageUploader = ({ setFilePath, file, setFile, inputSource }) => { 
    const { data: session } = useSession();

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if(inputSource=="inputchat")
        {setFile(selectedFile);}
        if (selectedFile) {
            console.log("Archivo seleccionado:", selectedFile);
            const uploadedFilePath = await handleUpload(selectedFile); 
            if (uploadedFilePath) {
                console.log("Ruta del archivo devuelta:", uploadedFilePath);
                setFilePath(uploadedFilePath);
            } else {
                console.error("Error al obtener la ruta del archivo.");
            }
        }
    };

    const handleUpload = async (selectedFile) => { // Agrega inputSource como parámetro
        if (!selectedFile) {
            console.error('No se ha seleccionado ningún archivo.');
            return null;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('source', inputSource); // Envía inputSource a la API
        console.log('Preparando para subir el archivo:', selectedFile);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.user?.accessToken}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Imagen subida correctamente:', data);
                return data.filePath; 
            } else {
                console.error('Error al subir la imagen:', data.error);
                return null;
            }
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            return null;
        }
    };

    return (
        <div>
            <input 
                type="file" 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden"
                id="file-upload"
            />
            <button
                type="button"
                className="text-white px-4 py-2 rounded bg-blue-500 hover:bg-blue-600"
                onClick={() => document.getElementById('file-upload').click()}
            >
                Seleccionar imagen
            </button>
            {/* Ya no necesitas mostrar la previsualización aquí */}
        </div>
    );
};

export default ImageUploader;
