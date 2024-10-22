'use client';
import CircularRadiusExam from "@/components/CircularRadiusExam"; // Usa la ruta correcta
import StudentsCounter from "@/components/StudentsCounter";
import Announcements from "@/components/Announcements";
import { useState } from "react";
//import { useContext } from "react";
//import ModalContext from "@/context/ModalContext";
const Home = () => {
    // Obtiene la fecha actual
    const now = new Date();
    //const { isRegisterModalOpen, setIsRegisterModalOpen } = useContext(ModalContext);causas confusiones con otro componente y hace que se abra
    //crear otro contexto o estado
    const [ModalOpen,setIsModalOpen]=useState(false);
    return (
        //<div className={`${isRegisterModalOpen ? "blur-sm" : ""}`}></div>//
        // Con (mx-2 md:mx-10 lg:mx-[10rem]) hacemos la responsividad en modo móvil, escritorio y tablet
        <div  >
            <Announcements isModalOpen={ModalOpen} setModalOpen={setIsModalOpen}/>
                <div className={`flex flex-row mx-2 md:mx-10 lg:mx-[10rem] space-x-4 ${ModalOpen ? "blur-sm" : ""}`}>
                    <div className="flex-1">
                        <StudentsCounter />
                    </div>
                    <div className="flex-1">
                        <CircularRadiusExam
                            startDate={'2024-09-01'}
                            dateExam={'2024-09-30'}
                            fechaActual={now}
                        />
                    </div>
                </div>
            
        </div>
    );
}

export default Home;
