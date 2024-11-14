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
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            setRecorder(mediaRecorder);
            setIsRecording(true);
            setTime(0);
            
            const chunks = [];
            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunks, { type: "audio/wav" });
                setFile(audioBlob);
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioUrl(audioUrl);
                await handleUpload(audioBlob);
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
                console.log("Audio subido correctamente:", data);
                setFilePath(data.filePath);
            } else {
                console.error("Error al subir el audio:", data.error);
            }
        } catch (error) {
            console.error("Error al subir el audio:", error);
        }
    };

    return (
        <div className="audio-uploader flex items-center space-x-4">
            <button
                onClick={isRecording ? pauseRecording : startRecording}
                className={`px-4 py-2 rounded-full ${isRecording ? "bg-yellow-500" : "bg-green-500"} text-white`}
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
                className="px-4 py-2 rounded bg-red-500 text-white"
            >
                Finalizar
            </button>
        </div>
    );
}

export default InputRecorder;
