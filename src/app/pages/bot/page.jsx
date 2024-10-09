'use client'
import ChatBox from '@/app/components/ChatBox'; // Usa la ruta correcta
import InputBox from '@/app/components/InputBox'; // Usa la ruta correcta

const Bot = () => {
  return (
    // Con (mx-2 md:mx-10 lg:mx-[10rem]) hacemos la responsividad en modo móvil, escritorio y tablet 
    <div className="mx-2 md:mx-10 lg:mx-[10rem] grid grid-cols-12 grid-rows-12 col-span-12 row-span-10">
      <ChatBox className="col-span-12 row-span-11" />
      <InputBox className="col-span-12 row-span-1" />
    </div>
  );
};

export default Bot;
