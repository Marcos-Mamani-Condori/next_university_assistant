'use client';
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = ({ onClose, setIsLoged, toggleLoginRegister }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState(null);

  const onSubmit = handleSubmit(async (data) => {
    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (res.error) {
      console.log('Error al iniciar sesión:', res.error); 
      setError(res.error);
    } else {
      console.log('Inicio de sesión exitoso'); 
      setIsLoged(true); 
      router.push('/'); 
      onClose(); 
    }
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()} 
      >
        <button
          className="text-gray-500 hover:text-gray-700 float-right text-2xl"
          onClick={onClose} 
        >
          ×
        </button>
        {error && ( 
          <p className="bg-red-500 text-lg text-white p-3 rounded">{error}</p>
        )}
        <h1 className="text-slate-200 font-bold text-4xl mb-4">LOGIN</h1>
        <form onSubmit={onSubmit}> 
          <label htmlFor="nombre" className="text-slate-500 mb-2 block text-sm">
            Nombre:
          </label>
          <input
            type="text"
            {...register("username", {
              required: {
                value: true,
                message: "usuario es requerido",
              },
            })}
            className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
            placeholder="nombre"
          />
          {errors.username && ( 
            <span className="text-red-500 text-xs">{errors.username.message}</span>
          )}

          <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">
            Password:
          </label>
          <input
            type="password"
            {...register("password", {
              required: {
                value: true,
                message: "Password es requerido",
              },
            })}
            className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
            placeholder="********"
          />
          {errors.password && ( 
            <span className="text-red-500 text-sm">{errors.password.message}</span>
          )}
          <button className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2">
            Login
          </button>
        </form>

        <button
          onClick={() => {
            toggleLoginRegister(); 
          }}
          className="w-full p-3 text-blue-600 hover:text-blue-700 mt-4"
        >
          ¿No tienes cuenta? Regístrate
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
