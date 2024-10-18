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
        <div className="pt-2 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto h-screen pb-64 lg:pb-10">
            <div className="col-span-2 md:col-span-1 lg:col-span-1">
                <StudentsCounter />
            </div>

            {/* Alineado hacia arriba en pantallas grandes (escritorio) */}
            <div className="col-span-2 md:col-span-1 lg:col-span-1 flex items-center lg:items-start justify-center">
                <CircularRadiusExam
                    startDate={'2024-10-17'}
                    dateExam={'2024-10-29'}
                    fechaActual={now}
                />
            </div>

            <div className="col-span-2 md:col-span-1 lg:col-span-1">
                <ActivityCalendar activities={activities} />
            </div>
        </div>
    );
}

export default Home;
