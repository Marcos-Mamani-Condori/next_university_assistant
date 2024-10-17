import CircularRadiusExam from "@/components/CircularRadiusExam"; // Usa la ruta correcta
import StudentsCounter from "@/components/StudentsCounter";
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

    return (
        // Con (mx-2 md:mx-10 lg:mx-[10rem]) hacemos la responsividad en modo móvil, escritorio y tablet
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
    );
}

export default Home;
