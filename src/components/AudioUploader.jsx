'use client';

import React, { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';

function InputRecorder({ setFilePath, file, setFile }) {
    const { data: session } = useSession();
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [time, setTime] = useState(0);
    const [recorder, setRecorder] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [stream, setStream] = useState(null); // Guardar el stream
    const [showButtons, setShowButtons] = useState(false); // Controlar la visibilidad de los botones de pausar y finalizar

    useEffect(() => {
        let intervalId;

        if (isRecording && !isPaused) {
            intervalId = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [isRecording, isPaused]);

    const startRecording = async () => {
        try {
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(audioStream);
            setRecorder(mediaRecorder);
            setStream(audioStream); // Guardar el stream
            setIsRecording(true);
            setTime(0);
            setShowButtons(true); // Mostrar botones de pausar y finalizar

            const chunks = [];
            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunks, { type: "audio/wav" });
                setFile(audioBlob);
                await handleUpload(audioBlob);

                audioStream.getTracks().forEach(track => track.stop());
                setStream(null); 
            };

            mediaRecorder.start();
        } catch (err) {
            alert("Permiso de Micrófono Necesario. Por favor, activa los permisos del micrófono para grabar audio.");
            console.error("Error al obtener permisos de micrófono:", err);
        }
    };

    const pauseRecording = () => {
        if (recorder && recorder.state === "recording") {
            recorder.pause();
            setIsPaused(true);
        } else if (recorder && recorder.state === "paused") {
            recorder.resume();
            setIsPaused(false);
        }
    };

    const stopRecording = () => {
        if (recorder) {
            setIsRecording(false);
            setIsPaused(false);
            recorder.stop();
        }

        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setShowButtons(false); // Ocultar botones de pausar y finalizar después de parar la grabación
    };

    const handleUpload = async (audioBlob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob);
        formData.append('inputSource', "audio");

        try {
            const response = await fetch('/api/upload-audio', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.user?.accessToken}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setFilePath(data.filePath);
            } else {
                console.error("Error al subir el audio:", data.error);
            }
        } catch (error) {
            console.error("Error al subir el audio:", error);
        }
    };

    return (
        <div className="audio-uploader flex flex-col items-center space-y-4">
            {/* Botón de Grabar */}
            {!showButtons && (
                <button
                    onClick={startRecording}
                    className="px-6 py-3 rounded-full bg-green-500 text-white"
                >
                    Grabar
                </button>
            )}

            {/* Botones Pausar, Reanudar y Finalizar */}
            {showButtons && (
                <div className="flex flex-col items-center space-y-2">
                    <button
                        onClick={pauseRecording}
                        className={`px-6 py-3 rounded-full ${isRecording && !isPaused ? "bg-yellow-500" : "bg-blue-500"} text-white`}
                    >
                        {isRecording && !isPaused ? "Pausar" : isPaused ? "Reanudar" : "Grabar"}
                    </button>

                    {isRecording && (
                        <div className="timer text-lg font-bold">
                            {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
                        </div>
                    )}

                    <button
                        onClick={stopRecording}
                        disabled={!isRecording}
                        className="px-6 py-3 rounded-full bg-red-500 text-white"
                    >
                        Finalizar
                    </button>
                </div>
            )}
        </div>
    );
}

export default InputRecorder;
