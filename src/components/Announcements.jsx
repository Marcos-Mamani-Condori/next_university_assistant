'use client';

import { useState, useEffect } from "react";
import AnnouncementsModal from './AnnouncementsModal';

const Announcements = ({ isModalOpen, setModalOpen, className }) => {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalContent, setModalContent] = useState(null);

  // Fetch los anuncios desde la API
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('/api/announcements');
        const announcements = await response.json();

        if (Array.isArray(announcements) && announcements.length) {
          setData(announcements);
        } else {
          // Maneja el caso si no hay anuncios
          setData([{
            id: 0,
            title: "No hay anuncios disponibles",
            image_url: "https://via.placeholder.com/300x200?text=Sin+Anuncios",
            date: null,
            created_at: null,
          }]);
        }
      } catch (error) {
        console.error("Error al obtener los anuncios:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isModalOpen) {
        setCurrentIndex((prevIndex) =>
          prevIndex === data.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [data.length, isModalOpen]);

  const handleContainerClick = (item) => {
    setModalContent(item);
    setModalOpen(true);
  };

  const handleNextInModal = () => {
    const nextIndex = (currentIndex + 1) % data.length;
    setModalContent(data[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  const handlePrevInModal = () => {
    const prevIndex = (currentIndex - 1 + data.length) % data.length;
    setModalContent(data[prevIndex]);
    setCurrentIndex(prevIndex);
  };

  if (!data.length) return <div className="text-center">Cargando...</div>;

  return (
    <>
      <div
        className={`row-span-3 relative h-full col-span-12 flex items-center justify-center  rounded-lg  ${isModalOpen ? "blur-sm" : ""} ${className}`}
        style={{
          // backgroundImage: `url("https://i.blogs.es/89aaa3/650_1000_bliss-original/1366_2000.jpg")`,
          backgroundSize: "cover", // Imagen de fondo para todo el contenedor
          backgroundPosition: "center",
        }}
      >
        <div className="relative overflow-hidden w-full ">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {data.map((item, index) => (
              <div
                key={index}
                className="min-w-full flex items-center justify-center bg-transparent "
              >
                <div
                  className="rounded-lg shadow-lg p-12 cursor-pointer bg-white bg-opacity-80 flex flex-col justify-center items-center"
                  onClick={() => handleContainerClick(item)}
                  style={{
                    width: "40%", // Ancho del 40% (ajustable)
                    height: "100%", // Alto completo (100% de su contenedor)
                    backgroundImage: `url(${item.image_url})`, // Fondo solo para el texto
                    backgroundSize: "cover", // La imagen cubre el fondo
                    backgroundPosition: "center", // Centra la imagen
                  }}
                >
                  <div className="text-black  font-bold content-center">
                    <p className="text-sm ">{item.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botones de navegación */}
        <button
          onClick={() =>
            setCurrentIndex((prevIndex) =>
              prevIndex === 0 ? data.length - 1 : prevIndex - 1
            )
          }
          className="absolute left-0 top-0 bottom-0 w-12 bg-transparent text-gray-500 hover:text-blue-500 hover:bg-neutral-300 focus:outline-none "
        >
          &lt;
        </button>
        <button
          onClick={() =>
            setCurrentIndex((prevIndex) =>
              prevIndex === data.length - 1 ? 0 : prevIndex + 1
            )
          }
          className="absolute right-0 h-full top-0 bottom-0 w-12 bg-transparent text-gray-500 hover:text-blue-500 hover:bg-neutral-300 focus:outline-none"
        >
          &gt;
        </button>
      </div>

      <AnnouncementsModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        content={modalContent}
        onNext={handleNextInModal}
        onPrev={handlePrevInModal}
      />
    </>
  );
};

export default Announcements;
