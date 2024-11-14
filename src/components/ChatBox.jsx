'use client';
import { useRef, useEffect, useContext, useState } from "react";
import MessageBot from "@/components/MessageBot";
import SCMessage from "@/components/MessageChatGlobal";
import  BotContext  from "@/context/BotContext";
import { usePathname } from 'next/navigation'; 
import ChatGlobalContext from "@/context/ChatGlobalContext";

function ChatBox({ className }) {
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [loadingTimeout, setLoadingTimeout] = useState(null);
    const pathname = usePathname(); 
    const context = pathname === "/bot" ? BotContext : ChatGlobalContext;
    const { messages, loadMoreMessages, hasMoreMessages } = useContext(context);

    const handleScroll = () => {
        const container = containerRef.current;
        if (!container) return;

        if (container.scrollTop === 0 && !loading && hasMoreMessages) {
            setLoading(true);

            if (loadingTimeout) {
                clearTimeout(loadingTimeout);
            }

            const timeout = setTimeout(() => {
                handleLoadMoreMessages();
            }, 1500); 
            setLoadingTimeout(timeout);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [pathname, messages]); 

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleLoadMoreMessages = () => {
        const container = containerRef.current;
        if (!container) return;

        const previousScrollTop = container.scrollTop;
        const previousScrollHeight = container.scrollHeight;

        loadMoreMessages();

        setTimeout(() => {
            container.scrollTop = previousScrollTop + (container.scrollHeight - previousScrollHeight);
            setLoading(false);
        }, 120); 
    };
    return (
        <div
            ref={containerRef}
            className={`${className} overflow-y-auto h-full flex-1 bg-gray-100 relative`}
            onScroll={pathname === "/chat" ? handleScroll : undefined} 
        >
            {loading && hasMoreMessages && (
                <div className="absolute top-0 left-0 right-0 bg-white text-center py-2">
                    Cargando mensajes antiguos...
                </div>
            )}

            {messages.map((msg, index) => {
                return pathname === "/bot" 
                    ? <MessageBot key={index} text={msg.text} sender={msg.sender}  imageUrl={msg.image_url} profileUrl={msg.profile_url} />
                    : <SCMessage key={index} text={msg.message} sender={msg} id={msg.id} image_url={msg.image_url} profileUrl={msg.profileUrl}  />;
            })}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default ChatBox;
