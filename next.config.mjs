///** @type {import('next').NextConfig} */
//const nextConfig = {};

//export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignorar ESLint durante el proceso de build
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http', // Cambia a 'http' si tu dominio no usa HTTPS
        hostname: 'localhost', // Sustituye con tu dominio
        port: '3000', // Deja vacío si usas los puertos estándar
        pathname: '/uploads/**', // Ruta que incluye todas las imágenes dentro de /uploads/
      },
    ],
  },
};

export default nextConfig;
