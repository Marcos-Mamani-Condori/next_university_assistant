import React from "react";

const CircularRadiusExam = ({ startDate, dateExam, fechaActual }) => {
    const start = new Date(startDate);
    const end = new Date(dateExam);
    const now = new Date(fechaActual);

    const totalDuration = end - start; 
    const currentDuration = now - start;const percentage = Math.min(
        Math.max((currentDuration / totalDuration) * 100, 0),
        100
    ); 

    const getColor = (percentage) => {
        if (percentage >= 100) return '#10B981'; 
        if (percentage === 0) return '#10B981'; 

        const red = Math.min(255, Math.floor(255 * (percentage / 100)));
        const green = Math.min(255, Math.floor(255 * (1 - percentage / 100)));
        return `rgb(${red}, ${green}, 0)`;
    };

    const circleRadius = 14;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const strokeDashoffset =
        circleCircumference - (circleCircumference * percentage) / 100;

    const daysPastEndDate = Math.ceil((now - end) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));

    const centerText =
        daysPastEndDate > 3 ? 'Sin fecha de examen' :
            percentage >= 100 ? 'Días de examen' :
                daysRemaining === 1 ? 'Falta 1 día' :
                    `Faltan ${daysRemaining} días`;

    const progressColor = daysPastEndDate > 3 ? 'text-gray-500 dark:text-neutral-700' : getColor(percentage);

    return (
        <div className="row-span-4 col-span-6  flex flex-col items-center">
            <span className="text-xl font-semibold text-red-800">Fecha de Examen</span>

            <div className="relative w-40 h-40">
                <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 36 36"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        cx="18"
                        cy="18"
                        r={circleRadius}
                        fill="none"
                        className="stroke-current text-gray-200 dark:text-neutral-700"
                        strokeWidth="2"
                    />
                    <circle
                        cx="18"
                        cy="18"
                        r={circleRadius}
                        fill="none"
                        stroke={progressColor}
                        strokeWidth="2"
                        strokeDasharray={circleCircumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </svg>

                <div className="absolute top-1/2 left-1/2 text-center transform -translate-y-1/2 -translate-x-1/2">
                    <span className="text-center text-xl font-semibold text-blue-600 dark:text-blue-600">
                        {centerText}
                    </span>
                </div>
            </div>
        </div>

    );
};

export default CircularRadiusExam;
