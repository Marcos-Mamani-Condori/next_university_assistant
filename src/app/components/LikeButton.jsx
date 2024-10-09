'use client'
import React, { useState, useEffect, useContext } from "react";
import ChatGlobalContext from "@app/context/ChatGlobalContext";
import RegisterModal from "@app/components/RegisterModal";

function LikeButton({ messageId, username }) {
  const { newSocket } = useContext(ChatGlobalContext); // Obtener el socket del contexto
  const [likeCount, setLikeCount] = useState(0); // Estado para el contador de likes
  const [hasLiked, setHasLiked] = useState(false); // Estado para saber si el usuario ha dado like
  const [isModalOpen, setIsModalOpen] = useState(false); 
  useEffect(() => {
    if (!newSocket) {
      console.log("Socket no está disponible."); // Mensaje de error si el socket no está disponible
      return;
    }

    const token = localStorage.getItem("token"); // Obtener el token del localStorage

    // Función para cargar los datos de likes
    const loadLikeData = () => {
      if (newSocket.connected) {
        newSocket.emit("get_like_count", messageId); // Solicitar el contador de likes

        if (token) {
          newSocket.emit("check_user_like", { messageId, token }); // Comprobar si el usuario ha dado like
        } else {
          console.log(
            "No hay token, no se puede comprobar si el usuario ha dado like."
          ); // Mensaje de error
        }
      } else {
        console.log("Socket no está conectado."); // Mensaje si el socket no está conectado
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
  }, [messageId, newSocket]); // Dependencias del useEffect

  // Manejar el clic en el botón de like
  const handleLikeClick = () => {
    const token = localStorage.getItem("token"); // Obtener el token del localStorage

    if (newSocket) {
      newSocket.emit("like_pregunta", { messageId, username, token }); // Emitir evento de like

      // Actualizar el contador de likes localmente
      setLikeCount((prevCount) => {
        const newCount = hasLiked ? prevCount - 1 : prevCount + 1; // Incrementar o decrementar el contador
        return newCount;
      });
      // Actualizar el estado de like
      setHasLiked((prevState) => {
        const newState = !prevState; // Cambiar el estado de like
        return newState;
      });
    }
  };

  return (
    <div className="flex justify-start mt-2">
      <button onClick={handleLikeClick}>
        <span
          className={
            hasLiked ? "bg-red-500 text-white p-2 rounded" : "bg-transparent"
          }
        >
          👍
        </span>
      </button>
      <span className="ml-2">{likeCount}</span> {/* Contador de likes */}
    </div>
  );
}

export default LikeButton;
