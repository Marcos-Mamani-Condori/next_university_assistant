'use client';

import CircularRadiusExam from "@/components/CircularRadiusExam";
import StudentsCounter from "@/components/StudentsCounter";
import Announcements from "@/components/Announcements";
import Homework from "@/components/Homework";
import { useState } from "react";
//import { useContext } from "react";
//import ModalContext from "@/context/ModalContext";
import ActivityCalendar from "@/components/ActivityCalendar";

const activities = [
    { day: "20", month: "Oct", title: "Aniversario de la UNIVERSIDAD LOYOLA" },
    { day: "28", month: "Oct", title: "Exámenes 1er Ciclo UAM-4" },
    { day: "02", month: "Nov", title: "Feriado Todos Santos" },
    { day: "04", month: "Nov", title: "Inicio 2° Ciclo UAM-4" },
    { day: "25", month: "Nov", title: "Exámenes 2° Ciclo UAM-4" },
];

const Home = () => {
    
    const now = new Date();
    
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        //<div className={`${isRegisterModalOpen ? "blur-sm" : ""}`}></div>//
        <div className="mx-2 md:mx-10 lg:mx-[10rem] grid grid-rows-12 col-span-12 row-span-12">
            <Announcements isModalOpen={isModalOpen} setModalOpen={setIsModalOpen} />
                    <Homework />

                    <CircularRadiusExam
                        startDate={'2024-10-17'}
                        dateExam={'2024-10-29'}
                        fechaActual={now}
                    />

                    <StudentsCounter />
                
                    <ActivityCalendar activities={activities} /> 
            
            
        </div>
    );
}

export default Home;
