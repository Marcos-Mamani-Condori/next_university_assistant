'use client'; // Asegura que el componente sea interactivo en el lado del cliente

import React, { useState, useEffect, useContext } from "react";
import ChatGlobalContext from "@/context/ChatGlobalContext";
import { useSession } from "next-auth/react"; // Importa useSession para obtener el token de autenticación

function LikeButton({ messageId, username }) {
  const { newSocket } = useContext(ChatGlobalContext); // Obtener el socket del contexto
  const [likeCount, setLikeCount] = useState(0); // Estado para el contador de likes
  const [hasLiked, setHasLiked] = useState(false); // Estado para saber si el usuario ha dado like
  const { data: session } = useSession(); // Obtener datos de sesión, incluido el token

  // Cargar datos de likes al montar el componente
  useEffect(() => {
    if (!newSocket) {
      return; 
    }

    const accessToken = session?.user?.accessToken; // Obtener el token de la sesión

    // Función para cargar los datos de likes
    const loadLikeData = () => {
      if (newSocket.connected) {
        newSocket.emit("get_like_count", messageId); // Solicitar el contador de likes

        if (accessToken) {
          newSocket.emit("check_user_like", { messageId, token: accessToken }); // Comprobar si el usuario ha dado like
        }
      }
    };

    loadLikeData(); // Llamar a la función para cargar datos de likes

    // Manejar la respuesta del contador de likes
    const handleLikeCountResponse = ({ preguntas_id, total_likes }) => {
      if (preguntas_id === messageId) {
        setLikeCount(total_likes); // Actualizar el contador de likes
      }
    };

    // Manejar el estado de like del usuario
    const handleUserLikeStatus = ({ preguntas_id, has_liked }) => {
      if (preguntas_id === messageId) {
        setHasLiked(has_liked); // Actualizar si el usuario ha dado like
      }
    };

    // Escuchar eventos del socket
    newSocket.on("like_count_response", handleLikeCountResponse);
    newSocket.on("user_like_status", handleUserLikeStatus);

    // Limpieza del efecto al desmontar
    return () => {
      newSocket.off("like_count_response", handleLikeCountResponse); // Limpiar el listener
      newSocket.off("user_like_status", handleUserLikeStatus); // Limpiar el listener
    };
  }, [messageId, newSocket, session]); // Dependencias del useEffect

  // Manejar el clic en el botón de like
  const handleLikeClick = () => {
    const accessToken = session?.user?.accessToken; // Obtener el token de la sesión

    if (!newSocket || !accessToken) {
      return;
    }

    // Console.log para verificar el username
    console.log(`Enviando like para mensaje ID ${messageId} con username ${username} y token ${accessToken}`);

    newSocket.emit("like_pregunta", { messageId, username, token: accessToken }); // Enviar el evento de like con el token y el username

    // Actualizar el contador de likes localmente
    setLikeCount((prevCount) => {
      const newCount = hasLiked ? prevCount - 1 : prevCount + 1; 
      return newCount;
    });
    setHasLiked((prevState) => !prevState); // Alternar el estado de like
  };

  return (
    <div className="flex justify-start mt-2">
      <button onClick={handleLikeClick}>
        <span
          className={hasLiked ? "bg-red-500 text-white p-2 rounded" : "bg-transparent"}
        >
          👍
        </span>
      </button>
      <span className="ml-2">{likeCount}</span> 
    </div>
  );
}

export default LikeButton;
