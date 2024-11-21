"use client";
const ActivityCalendar = ({ activities }) => {

    const displayedActivities = activities.slice(0, 5);

    return (
        <div className="row-span-6 p-3 col-span-7 overflow-y-auto w-full max-w-md">
            <h2 className="mb-0 text-xl font-semibold text-red-800">Actividades</h2>
            {displayedActivities.length > 0 ? (
                <ul>
                    {displayedActivities.map((activity, index) => (
                        <li key={index} className="flex items-center p-1">
                            <a href="#" className="flex items-center w-full text-gray-700 hover:underline">
                                <div className="flex flex-col items-center justify-center w-12 h-12 mr-2 text-white bg-red-800 rounded-full">
                                    <span className="text-2xl font-bold">{activity.day}</span>
                                    <span className="text-xs uppercase">{activity.month}</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm tracking-tighter">{activity.title}</p>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No hay actividades disponibles</p>
            )}
        </div>
    );
};

export default ActivityCalendar;