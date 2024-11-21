import React from "react";

const BatteryGridExam = ({ startDate, dateExam, fechaActual }) => {
    const start = new Date(startDate);
    const end = new Date(dateExam);
    const now = new Date(fechaActual);

    // Calcular la duración total entre la fecha de inicio y la fecha de examen
    const totalDuration = end - start;

    // Calcular los días restantes
    const daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));

    // Asegurarse de que no haya un valor de porcentaje muy pequeño o negativo
    const remainingPercentage = (daysRemaining / (Math.ceil(totalDuration / (1000 * 60 * 60 * 24)))) * 100;

    // Función para obtener el color basado en el porcentaje de días restantes
    const getColor = (percentage) => {
        if (percentage >= 50) return '#10B981'; // Verde
        if (percentage >= 20) return '#F59E0B'; // Naranja
        return '#EF4444'; // Rojo
    };

    // Obtener el color de la barra basado en el porcentaje de días restantes
    const progressColor = getColor(remainingPercentage);

    // Calcular el número de "barritas" basadas en el porcentaje restante
    const totalBars = 20; // Número total de barras
    const filledBars = Math.ceil((remainingPercentage / 100) * totalBars); // Número de barras llenas

    // Texto en el centro
    const centerText =
        daysRemaining === 0 ? '¡Hoy es el examen!' :
            daysRemaining === 1 ? 'Falta 1 día' :
                `Faltan ${daysRemaining} días`;

    return (
        <div className="row-span-3 col-span-5 flex flex-col items-center p-3">
            <span className="text-xl font-semibold text-red-800 text-center">Fecha de Examen</span>

            {/* Barra de progreso */}
            <div className="relative w-full max-w-xs h-6 bg-gray-300 rounded-lg border border-black">
                {/* Contenedor de las barras de progreso */}
                <div className="flex w-full h-full">
                    {/* Dibuja las barras desde el final, el color cambia según la fecha */}
                    {[...Array(totalBars)].map((_, index) => (
                        <div
                            key={index}
                            style={{
                                flex: 1, // Para que cada barra ocupe un espacio proporcional
                                backgroundColor: index >= totalBars - filledBars ? "#E5E7EB" : progressColor, // Colorear la barra vacía primero
                                border: "1px solid #000", // Borde negro para cada barra
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Texto central */}
            <div className="mt-2">
                <span className="text-center text-xl font-semibold text-blue-600 dark:text-blue-600">
                    {centerText}
                </span>
            </div>
        </div>
    );
};

export default BatteryGridExam;
