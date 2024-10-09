'use client'
import { BotProvider } from "@/app/context/BotContext";
import { DeviceProvider } from "@/app/context/DeviceContext";
import { InputFocusProvider } from "@/app/context/InputFocusContext";
import { ChatGlobalProvider } from '@/app/context/ChatGlobalContext';
import { ModalProvider } from '@/app/context/ModalContext';

const ProvidersContext = ({ children }) => {
  return (
    <ModalProvider>
    <DeviceProvider>
      <ChatGlobalProvider>
        <BotProvider>
          <InputFocusProvider>
          {children}
          </InputFocusProvider>
        </BotProvider>
      </ChatGlobalProvider>
    </DeviceProvider>
    </ModalProvider>
  );
};

export default ProvidersContext;