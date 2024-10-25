import React, { useEffect, useState } from 'react';
import lockIcon from '@/public/static/user_icon.png';

const Homework = () => {
  //BORRAR DATOS QUEMADOS
  const [tareas, setTareas] = useState([{
    "id":1,
    "name":"esta es la tarea de sistemas 1",
    "message":"la tarea es hacer a",
    "carrera":"sistemas",
    "fecha": "2000-05-15"
},{
    "id":2,
    "name":"esta es la tarea de sistemas 2",
    "message":"la tarea es hacer b",
    "carrera":"sistemas",
    "fecha": "2001-05-15"
},{
    "id":3,
    "name":"esta es la tarea de sistemas 3",
    "message":"la tarea es hacer c",
    "carrera":"sistemas",
    "fecha": "2002-05-15"
},{
    "id":4,
    "name":"esta es la tarea de civil 1",
    "message":"la tarea es hacer c",
    "carrera":"civil",
    "fecha": "2002-05-15"
},{
    "id":5,
    "name":"esta es la tarea de civil 2",
    "message":"la tarea es hacer a",
    "carrera":"civil",
    "fecha": "2000-05-15"
},{
    "id":6,
    "name":"esta es la tarea de sistemas 4",
    "message":"la tarea es hacer b",
    "carrera":"sistemas",
    "fecha": "2001-05-15"
},{
    "id":7,
    "name":"esta es la tarea de veterinaria 1",
    "message":"la tarea es hacer c",
    "carrera":"veterinaria",
    "fecha": "2002-05-15"
},{
    "id":8,
    "name":"esta es la tarea de civil 4",
    "message":"la tarea es hacer c",
    "carrera":"civil",
    "fecha": "2002-05-15"
},{
    "id":9,
    "name":"esta es la tarea de civil 1",
    "message":"la tarea es hacer a",
    "carrera":"civil",
    "fecha": "2000-05-15"
},{
    "id":10,
    "name":"esta es la tarea de sistemas 5",
    "message":"la tarea es hacer b",
    "carrera":"sistemas",
    "fecha": "2001-05-15"
},{
    "id":11,
    "name":"esta es la tarea de civil 5",
    "message":"la tarea es hacer c",
    "carrera":"civil",
    "fecha": "2002-05-15"
},{
    "id":12,
    "name":"esta es la tarea de veterinaria 2",
    "message":"la tarea es hacer c",
    "carrera":"veterinaria",
    "fecha": "2002-05-15"
}]);
  const [usuarios, setUsuarios] = useState([{
    "id":1,
    "carrera":"sistemas",
    "rol":"administrador"
},{
    "id":2,
    "carrera":"civil",
    "rol":"usuario"
},{
    "id":3,
    "carrera":"veterinaria",
    "rol":"premium"
},{
    "id":4,
    "carrera":"sistemas",
    "rol":"usuario"
},{
    "id":5,
    "carrera":"civil",
    "rol":"premium"
},{
    "id":6,
    "carrera":"veterinaria",
    "rol":"premium"
},{
    "id":7,
    "carrera":"sistemas",
    "rol":"premium"
}]);
//BORRAR DATOS QUEMADOS
const userId = 1; // Supongamos que el ID del usuario que está viendo la página es el 2.

  /*useEffect(() => {
    // Obtener datos del usuario
    const fetchUsuarios = async () => {
      try {
        const response = await fetch(`http://localhost:3001/usuarios`);
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error('Error al obtener los usuarios:', error);
      }
    };

    const fetchTareas = async () => {
      try {
        const response = await fetch(`http://localhost:3001/tareas`);
        const data = await response.json();
        setTareas(data);
      } catch (error) {
        console.error('Error al obtener las tareas:', error);
      }
    };

    fetchUsuarios();
    fetchTareas();
  }, []);
*/
  // Encontrar al usuario con el userId
  const usuarioActual = usuarios.find(usuario => usuario.id === userId);

  // Filtrar las tareas según la carrera del usuario, si el usuario está definido
  const tareasFiltradas = usuarioActual
    ? tareas.filter(tarea => tarea.carrera === usuarioActual.carrera)
    : [];

  // Verificar si el usuario no es premium o es administrador para aplicar blur
  const aplicarBlur = usuarioActual && usuarioActual.rol !== 'premium' && usuarioActual.rol !== 'administrador';

  return (
    <div
      className="bg-amber-50 p-4 rounded-lg shadow-lg mt-4"
      style={{ height: '300px', width: '90%', maxWidth: '770px', position: 'relative' }}
    >
      {aplicarBlur && (
        <img
          src="https://png.pngtree.com/png-vector/20191024/ourmid/pngtree-lock-line-icon-vector-png-image_1859174.jpg"
          alt="Imagen encima"
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: '0.5',
            zIndex: '1', // Hace que la imagen esté encima
          }}
        />
      )}

      <img src={lockIcon}/>
      <ul
        className={aplicarBlur ? 'blur-sm' : ''}
        style={{
          filter: aplicarBlur ? 'blur(4px)' : 'none',
          position: 'relative', // Mantiene la lista en la capa debajo de la imagen
          zIndex: '2', // Asegura que el contenido esté debajo de la imagen
        }}
      >
        {tareasFiltradas.length > 0 ? (
          tareasFiltradas.map(tarea => (
            <li key={tarea.id}>
              <strong>{tarea.name}</strong>
              <ul>
                <li>{tarea.message}</li>
                <li>{tarea.fecha}</li>
              </ul>
            </li>
          ))
        ) : (
          <p>No hay tareas disponibles para tu carrera.</p>
        )}
      </ul>
    </div>
  );
};

export default Homework;
