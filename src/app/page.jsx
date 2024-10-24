'use client';

import { useState } from "react";
import CircularRadiusExam from "@/components/CircularRadiusExam";
import StudentsCounter from "@/components/StudentsCounter";
import Announcements from "@/components/Announcements";
import ActivityCalendar from "@/components/ActivityCalendar";

const activities = [
    { day: "20", month: "Oct", title: "Aniversario de la UNIVERSIDAD LOYOLA" },
    { day: "28", month: "Oct", title: "Exámenes 1er Ciclo UAM-4" },
    { day: "02", month: "Nov", title: "Feriado Todos Santos" },
    { day: "04", month: "Nov", title: "Inicio 2° Ciclo UAM-4" },
    { day: "25", month: "Nov", title: "Exámenes 2° Ciclo UAM-4" },
];

const Home = () => {
    // Obtiene la fecha actual
    const now = new Date();
    
    // Estado para el modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <div>
            <Announcements isModalOpen={isModalOpen} setModalOpen={setIsModalOpen} />
            
            <div className={`flex flex-row mx-2 md:mx-10 lg:mx-[10rem] space-x-4 ${isModalOpen ? "blur-sm" : ""}`}>
                <div className="flex-1">
                    <StudentsCounter />
                </div>
                
            </div>

            <div className="flex flex-row mx-2 md:mx-10 lg:mx-[10rem] space-x-4">
                {/* Alineado hacia arriba en pantallas grandes (escritorio) */}
                <div className="flex-1">
                    <ActivityCalendar activities={activities} /> 
                </div>
                <div className="col-span-2 md:col-span-1 lg:col-span-1 flex items-center lg:items-start justify-center">
                    <CircularRadiusExam
                        startDate={'2024-10-17'}
                        dateExam={'2024-10-29'}
                        fechaActual={now}
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;
