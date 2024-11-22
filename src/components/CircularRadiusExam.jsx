import React from "react";

const BatteryGridExam = ({ startDate, dateExam, fechaActual }) => {
    const start = new Date(startDate);
    const end = new Date(dateExam);
    const now = new Date(fechaActual);

    const totalDuration = end - start;

    const daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));

    const remainingPercentage = (daysRemaining / (Math.ceil(totalDuration / (1000 * 60 * 60 * 24)))) * 100;

    const getColor = (percentage) => {
        if (percentage >= 50) return '#10B981'; 
        if (percentage >= 20) return '#F59E0B'; 
        return '#EF4444'; 
    };

    const progressColor = getColor(remainingPercentage);

    const totalBars = 20; 
    const filledBars = Math.ceil((remainingPercentage / 100) * totalBars); 

    const centerText =
        daysRemaining === 0 ? '¡Hoy es el examen!' :
            daysRemaining === 1 ? 'Falta 1 día para el examen' :
                `Faltan ${daysRemaining} días para el examen`;

    return (
        <div className="row-span-3 col-span-6 flex flex-col justify-center items-center">

            <div className="relative w-full max-w-xs h-8 bg-gray-300 rounded-lg border border-black">
                <div className="flex w-full h-full">
                    {[...Array(totalBars)].map((_, index) => (
                        <div
                            key={index}
                            style={{
                                flex: 1, 
                                backgroundColor: index >= totalBars - filledBars ? "#E5E7EB" : progressColor, 
                                border: "1px solid #000", 
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="mt-2">
                <span className="text-center text-xl font-semibold text-blue-600 dark:text-blue-600">
                    {centerText}
                </span>
            </div>
        </div>
    );
};

export default BatteryGridExam;
