/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignorar ESLint durante el proceso de build
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http', // Cambia a 'http' si tu dominio no usa HTTPS
        hostname: '192.168.18.12', // Primer dominio
        port: '3000', // Puerto del primer dominio
        pathname: '/uploads/**', // Ruta para las imágenes en el primer dominio
      },
      {
        protocol: 'http', // Protocolo para el segundo dominio
        hostname: 'localhost', // Segundo dominio
        pathname: '/uploads/**', // Ruta para las imágenes en el segundo dominio
      },
    ],
  },
};

export default nextConfig;
