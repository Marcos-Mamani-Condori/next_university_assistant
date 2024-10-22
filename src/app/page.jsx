'use client';
import CircularRadiusExam from "@/components/CircularRadiusExam"; // Usa la ruta correcta
import StudentsCounter from "@/components/StudentsCounter";
import Announcements from "@/components/Announcements";
import { useState } from "react";
//import { useContext } from "react";
//import ModalContext from "@/context/ModalContext";
import ActivityCalendar from "@/components/ActivityCalendar";

/////////////////////////////////////////////////////////////////
const activities = [
    { day: "20", month: "Oct", title: "Aniversario de la UNIVERSIDAD LOYOLA" },
    { day: "28", month: "Oct", title: "Exámenes 1er Ciclo UAM-4" },
    { day: "02", month: "Nov", title: "Feriado Todos Santos" },
    { day: "04", month: "Nov", title: "Inicio 2° Ciclo UAM-4" },
    { day: "25", month: "Nov", title: "Exámenes 2° Ciclo UAM-4" },
];
/////////////////////////////////////////////////////////////////


const Home = () => {
    // Obtiene la fecha actual
    const now = new Date();
    //const { isRegisterModalOpen, setIsRegisterModalOpen } = useContext(ModalContext);causas confusiones con otro componente y hace que se abra
    //crear otro contexto o estado
    const [ModalOpen,setIsModalOpen]=useState(false);
    return (
        //<div className={`${isRegisterModalOpen ? "blur-sm" : ""}`}></div>//
        // Con (mx-2 md:mx-10 lg:mx-[10rem]) hacemos la responsividad en modo móvil, escritorio y tablet
        <div>
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
            
        <div className="flex flex-row mx-2 md:mx-10 lg:mx-[10rem] space-x-4">
            <div className="flex-1">
                <StudentsCounter />
            </div>
            <div className="flex-1">
                <CircularRadiusExam
                    startDate={'2024-10-17'}
                    dateExam={'2024-10-29'}
                    fechaActual={now}
                />
            </div>
                <div className="flex-1">
                    <ActivityCalendar activities={activities} /> 
                </div>
        </div>
        </div>
    );
}

export default Home;
