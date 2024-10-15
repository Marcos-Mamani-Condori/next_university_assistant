import CircularRadiusExam from "@/components/CircularRadiusExam"; // Usa la ruta correcta
import StudentsCounter from "@/components/StudentsCounter";

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
                    startDate={'2024-09-01'}
                    dateExam={'2024-09-30'}
                    fechaActual={now}
                />
            </div>
        </div>
    );
}

export default Home;
