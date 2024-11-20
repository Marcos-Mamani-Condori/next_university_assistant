'use client';
import { useState, useEffect } from "react";

const StudentsCounter = () => {
  const [carrera, setCarrera] = useState([]); 
  const [carreraCount, setCarreraCount] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarrera = async () => {
      try {
        const response = await fetch("/api/connected-users/protected"); 

        if (!response.ok) {
          throw new Error("Error al obtener las carreras de los usuarios");
        }

        const data = await response.json();

        if (data.majors) {
            setCarrera(data.majors); 
        } else {
          setError("No se encontraron datos de usuarios.");
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError("Hubo un problema al cargar las carreras.");
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchCarrera(); 
  }, []);

  useEffect(() => {
    if (carrera.length > 0) {
      const count = carrera.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1; 
        return acc;
      }, {});
      setCarreraCount(count);
    }
  }, [carrera]);

  const totalCount = carrera.length;

  if (isLoading) {
    return (
      <div className="row-span-5 overflow-y-auto  max-w-md bg-white border border-gray-300 rounded-lg shadow-md">
        <p className="text-xl font-semibold pb-4">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="row-span-5 overflow-y-auto col-span-6 max-w-md bg-white border border-gray-300 rounded-lg shadow-md">
        <p className="text-xl font-semibold pb-4">{error}</p>
      </div>
    );
  }

  const sortedCarreraCount = Object.entries(carreraCount).sort((a, b) => b[1] - a[1]);

  return (
    <div className="row-span-5 overflow-y-auto col-span-6 max-w-md bg-white border border-gray-300 rounded-lg shadow-md">
      <p className="text-xl font-semibold pb-4">Usuarios registrados por carrera</p>
      {totalCount > 0 ? (
        <div>
          {sortedCarreraCount.map(([majorName, count]) => {
            const percentage = ((count / totalCount) * 100).toFixed(2);

            return (
              <div key={majorName} className="mb-2">
                <p className="py-1">{majorName}: {percentage}%</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No hay estudiantes conectados.</p>
      )}
    </div>
  );
};

export default StudentsCounter;
