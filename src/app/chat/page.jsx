'use client'
import ChatBox from '@/components/ChatBox'; // Usa la ruta correcta
import InputBox from '@/components/InputBox'; // Usa la ruta correcta

const Chat = () => {
  return (
    // Con (mx-2 md:mx-10 lg:mx-[10rem]) hacemos la responsividad en modo móvil, escritorio y tablet
    <div className="mx-2 md:mx-10 lg:mx-[10rem] grid grid-rows-12 col-span-12 row-span-12">
      <ChatBox className="row-span-11" />
      <InputBox className="row-span-1" />
    </div>
  );
};

export default Chat;
