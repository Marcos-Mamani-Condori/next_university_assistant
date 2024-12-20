'use client';
import { useState, useEffect } from "react";

const StudentsCounter = () => {
    //ELIMINAR DATOS QUEMADOS CUANDO SE LOGRE LA COMUNICACION
  const [carrera, setCarrera] = useState([{
    "id":1,
    "carrera":"sistemas"
},
{
    "id":2,
    "carrera":"comunicacion"
},
{
    "id":3,
    "carrera":"civil"
},
{
    "id":4,
    "carrera":"sistemas"
},
{
    "id":5,
    "carrera":"civil"
},
{
    "id":6,
    "carrera":"veterinaria"
},
{
    "id":7,
    "carrera":"sistemas"
},

{
    "id":8,
    "carrera":"veterinaria"
},
{
    "id":9,
    "carrera":"gastronomia"
},
{
    "id":10,
    "carrera":"civil"
},
{
    "id":11,
    "carrera":"sistemas"
},
{
    "id":12,
    "carrera":"sistemas"
},
{
    "id":13,
    "carrera":"sistemas"
},
{
    "id":14,
    "carrera":"veterinaria"
},
{
    "id":15,
    "carrera":"civil"
},
{
    "id":16,
    "carrera":"civil"
},
{
    "id":17,
    "carrera":"sistemas"
},
{
    "id":18,
    "carrera":"sistemas"
},
{
    "id":19,
    "carrera":"comunicacion"
},
{
    "id":20,
    "carrera":"sistemas"
},
{
    "id":21,
    "carrera":"comunicacion"
},
{
    "id":22,
    "carrera":"civil"
},
{
    "id":23,
    "carrera":"veterinaria"
},
{
    "id":24,
    "carrera":"sistemas"
},
{
    "id":25,
    "carrera":"gastronomia"
},
{
    "id":26,
    "carrera":"gastronomia"
}]);//ELIMINAR CUANDO ESTE LISTA LA BASE DE DATOS
  const [carreraCount, setCarreraCount] = useState({}); // Estado para contar carreras

  /*Realizar la comunicacion con el back
    const fetchCarrera = async () => {
    try {
      const response = await fetch("http://localhost:3001/estudiantes"); // Usando fetch
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json(); // Parsear respuesta como JSON
      setCarrera(data); // Suponiendo que data es un array de objetos
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchCarrera();
  }, []);*/

  useEffect(() => {
    // Contar las ocurrencias de cada carrera
    const count = carrera.reduce((acc, item) => {
      acc[item.carrera] = (acc[item.carrera] || 0) + 1; // Incrementar el contador
      return acc;
    }, {});

    setCarreraCount(count); // Guardar los resultados en el estado
  }, [carrera]); // Ejecutar este efecto cuando carrera cambie

  const totalCount = carrera.length; // Total de carreras

  return (
    <div className="p-4 max-w-md bg-white border border-gray-300 rounded-lg shadow-md">
      <p className="text-xl font-semibold text-red-800 pb-4">Usuarios Activos</p>
      {totalCount > 0 ? (
        <div>
          {Object.entries(carreraCount).map(([carreraName, count]) => {
            const percentage = ((count / totalCount) * 100).toFixed(2); // Calcular porcentaje
            
            // Procesar carreraName
            const formattedCarreraName = carreraName
              .trim() // Eliminar espacios al inicio y al final
              .split(' ') // Dividir en palabras
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalizar la primera letra de cada palabra
              .join(' '); // Unir las palabras nuevamente
  
            return (
              <div key={carreraName} className="mb-4 ">
                <p className="py-1">{formattedCarreraName}: {percentage}%</p>
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
        <p>Cargando...</p>
      )}
    </div>
  );
  
};

export default StudentsCounter;
