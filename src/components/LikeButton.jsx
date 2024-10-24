"use client";

import React, { useState, useEffect, useContext } from "react";
import ChatGlobalContext from "@/context/ChatGlobalContext";
import { useSession } from "next-auth/react";

function LikeButton({ messageId, username }) {
  const { newSocket, messages } = useContext(ChatGlobalContext);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const { data: session } = useSession();

  // Cargar estado de like desde localStorage al montar el componente
  useEffect(() => {
    const likedStatus = localStorage.getItem(`liked_${messageId}`);
    if (likedStatus !== null) {
      setHasLiked(JSON.parse(likedStatus));
    }

    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      setLikeCount(message.totalLikes || 0); // Asegúrate de que totalLikes esté en el mensaje
    }
  }, [messages, messageId]); // Dependencias del useEffect

  // Cargar datos de likes al montar el componente
  useEffect(() => {
    if (!newSocket) {
      return; 
    }

    const accessToken = session?.user?.accessToken;

    const loadLikeData = () => {
      if (newSocket.connected) {
        newSocket.emit("get_like_count", messageId);
        if (accessToken) {
          newSocket.emit("check_user_like", { messageId, token: accessToken });
        }
      }
    };

    loadLikeData(); // Cargar datos de likes

    const handleLikeCountResponse = ({ preguntas_id, total_likes }) => {
      if (preguntas_id === messageId) {
        setLikeCount(total_likes);
      }
    };

    const handleUserLikeStatus = ({ preguntas_id, has_liked }) => {
      if (preguntas_id === messageId) {
        setHasLiked(has_liked);
        // Almacenar el estado de like en localStorage
        localStorage.setItem(`liked_${messageId}`, JSON.stringify(has_liked));
      }
    };

    newSocket.on("like_count_response", handleLikeCountResponse);
    newSocket.on("user_like_status", handleUserLikeStatus);

    return () => {
      newSocket.off("like_count_response", handleLikeCountResponse);
      newSocket.off("user_like_status", handleUserLikeStatus);
    };
  }, [messageId, newSocket, session]); // Dependencias del useEffect

  // Escuchar evento cuando se cargan más mensajes
  useEffect(() => {
    const handleMoreMessagesLoaded = () => {
      console.log('Se han cargado más mensajes');
      // Aquí puedes realizar acciones adicionales si es necesario
    };

    newSocket.on("more_preguntas_loaded", handleMoreMessagesLoaded);

    return () => {
      newSocket.off("more_preguntas_loaded", handleMoreMessagesLoaded);
    };
  }, [newSocket]);

  const handleLikeClick = () => {
    const accessToken = session?.user?.accessToken;
  
    if (!newSocket || !accessToken) {
      return; // Asegúrate de que el socket y el token estén disponibles
    }
  
    if (hasLiked && likeCount === 0) {
      return; // Si ya ha dado like y el contador es 0, no hace nada
    }
  
    newSocket.emit("like_pregunta", { messageId, username, token: accessToken });
  
    // Actualizar localmente el contador de likes
    setLikeCount((prevCount) => {
      if (hasLiked && prevCount > 0) {
        return prevCount - 1; // Permitir restar si ha dado like y el contador es mayor a 0
      } else if (!hasLiked) {
        return prevCount + 1; // Agregar un like normalmente
      }
      return prevCount; // No hacer nada si no se cumplen las condiciones
    });
  
    setHasLiked((prevState) => {
      const newLikedState = !prevState;
      localStorage.setItem(`liked_${messageId}`, JSON.stringify(newLikedState)); // Guardar en localStorage
      return newLikedState;
    });
  };
  

  return (
    <div className="flex justify-start mt-2">
      <button onClick={handleLikeClick}>
        <span
          className={hasLiked ? "bg-red-500 text-white p-1 pt-0.5 rounded" : "bg-transparent"}
        >
          👍
        </span>
      </button>
      {/* Aqui se valida en no mostrar el numero 0 de los likes, solo si son mayores a 0 */}
      <span className="ml-2">{likeCount <=0 ? "": likeCount}</span> 
    </div>
  );
}

export default LikeButton;
