// app/layout.js
import '@/app/globals.css'; // Asegúrate de tener tus estilos globales
import Layout from '@/app/pages/layout';

export default function RootLayout({ children }) {
    return (
        <html lang="es"> 
            <body>
                <Layout>
                    {children}
                </Layout>
            </body>
        </html>
    );
}
