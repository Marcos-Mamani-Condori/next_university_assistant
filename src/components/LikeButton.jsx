"use client";

import React, { useState, useEffect, useContext } from "react";
import ChatGlobalContext from "@/context/ChatGlobalContext";
import { useSession } from "next-auth/react";
import ModalContext from '@/context/ModalContext';

function LikeButton({ messageId, username }) {
  const { newSocket } = useContext(ChatGlobalContext);
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const { data: session } = useSession();
  const { setIsRegisterModalOpen, setIsLoged } = useContext(ModalContext);

  useEffect(() => {
    if (!newSocket) {
      console.log("Socket no está disponible.");
      return;
    }

    const accessToken = session?.user?.accessToken;

    const loadLikeData = () => {
      if (newSocket.connected) {
        newSocket.emit("get_like_count", messageId);

        if (accessToken) {
          newSocket.emit("check_user_like", { messageId, token: accessToken });
        } else {
          console.log("No hay token, no se puede comprobar si el usuario ha dado like.");
        }
      }
    };

    loadLikeData();

    const handleLikeCountResponse = ({ preguntas_id, total_likes }) => {
      if (preguntas_id === messageId) {
        setLikeCount(total_likes);
      }
    };

    const handleUserLikeStatus = ({ preguntas_id, has_liked }) => {
      if (preguntas_id === messageId) {
        setHasLiked(has_liked);
        localStorage.setItem(`liked_${messageId}`, JSON.stringify(has_liked));
      }
    };

    newSocket.on("like_count_response", handleLikeCountResponse);
    newSocket.on("user_like_status", handleUserLikeStatus);

    return () => {
      newSocket.off("like_count_response", handleLikeCountResponse);
      newSocket.off("user_like_status", handleUserLikeStatus);
    };
  }, [messageId, newSocket, session]);

  const handleLikeClick = () => {
    const accessToken = session?.user?.accessToken;

    if (!newSocket || !accessToken) {
      setIsRegisterModalOpen(true);
      setIsLoged(false);
      return;
    }

    newSocket.emit("like_pregunta", { messageId, username, token: accessToken });

    setLikeCount((prevCount) => hasLiked ? Math.max(prevCount - 1, 0) : prevCount + 1);
    setHasLiked(!hasLiked);
    localStorage.setItem(`liked_${messageId}`, JSON.stringify(!hasLiked));
  };

  return (
    <div className="flex justify-start mt-2">
      <button onClick={handleLikeClick}>
        <span className={hasLiked ? "bg-red-500 text-white p-2 rounded" : "bg-transparent"}>
          👍
        </span>
      </button>
      <span className="ml-2">{likeCount > 0 ? likeCount : ""}</span>
    </div>
  );
}

export default LikeButton;
