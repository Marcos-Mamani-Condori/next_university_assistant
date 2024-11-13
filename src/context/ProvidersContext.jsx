'use client'
import { BotProvider } from "@/context/BotContext";
import { DeviceProvider } from "@/context/DeviceContext";
import { InputFocusProvider } from "@/context/InputFocusContext";
import { ChatGlobalProvider } from '@/context/ChatGlobalContext';
import { ModalProvider } from '@/context/ModalContext';
import { NotificationProvider } from "./NotificationContext";
import { useEffect } from "react";

const ProvidersContext = ({ children }) => {
  useEffect(() => {
    console.log('ProvidersContext montado');
    return () => {
      console.log('ProvidersContext desmontado');
    };
  }, []);
  return (
    <ModalProvider>
      <DeviceProvider>
        <NotificationProvider>
          <ChatGlobalProvider>
            <BotProvider>
              <InputFocusProvider>
                {children}
              </InputFocusProvider>
            </BotProvider>
          </ChatGlobalProvider>
        </NotificationProvider>
      </DeviceProvider>
    </ModalProvider>
  );
};

export default ProvidersContext;