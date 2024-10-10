import "@/app/globals.css"; // Asegúrate de tener tus estilos globales
import ProvidersContext from "@/context/ProvidersContext";
import Header from "@/components/header";
import NavBar from "@/components/navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ProvidersContext>
            <div className="grid grid-cols-12 grid-rows-10 w-full h-full fixed overflow-hidden">
              <Header className={"col-span-12 row-span-1"} />
              {children}
              <NavBar className={"col-span-12 row-span-1"} />
            </div>
        </ProvidersContext>
      </body>
    </html>
  );
}
