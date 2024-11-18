'use client';
import React from "react";
import { useSession } from 'next-auth/react';
import imageicon from '@/public/static/more.png';
import Image from "next/image";
const ImageUploader = ({ setFilePath, file, setFile, inputSource }) => { 
    const { data: session } = useSession();

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if(inputSource=="inputChat" || inputSource=="inputBot")
        {setFile(selectedFile);}
        if (selectedFile) {
            const uploadedFilePath = await handleUpload(selectedFile); 
            if (uploadedFilePath) {
                setFilePath(uploadedFilePath);
            } else {
                console.error("Error al obtener la ruta del archivo.");
            }
        }
    };
    const handleUpload = async (selectedFile) => { 
        if (!selectedFile) {
            console.error('No se ha seleccionado ningún archivo.');
            return null;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('inputSource', inputSource); 

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
            <Image
                src={imageicon} 
                alt="Seleccionar imagen" 
                onClick={() => document.getElementById('file-upload').click()}
                className="cursor-pointer"
                width={50} 
                height={50} 
            />
        </div>
    );
};

export default ImageUploader;
