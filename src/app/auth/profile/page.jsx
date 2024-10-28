'use client';
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useSession } from 'next-auth/react';

const inputBaseStyles = () => {
  return "p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full";
};

const labelBaseStyles = () => {
  return "text-slate-500 mb-2 block text-sm";
};

function ProfilePage({ onClose }) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Cargando...</div>;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues, // Asegúrate de que getValues esté importado
  } = useForm({
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      major: session?.user?.major || '',
    },
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar la contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para mostrar la confirmación

  const onSubmit = handleSubmit(async (data) => {
    const res = await fetch("/api/auth/put", {
      method: "PUT",
      body: JSON.stringify({
        name: isEditingName ? data.name : session.user.name,
        oldEmail: session.user.email,
        newEmail: isEditingEmail ? data.email : session.user.email,
        password: isEditingPassword ? data.password : null,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      alert("Perfil actualizado con éxito");
      onClose();
    } else {
      const errorData = await res.json();
      console.error("Error al actualizar el perfil:", errorData.message);
      setError(errorData.message);
    }
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-5"
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
        <h1 className="text-slate-200 font-bold text-4xl mb-4">Personalizar Perfil</h1>

        <form onSubmit={onSubmit} className="flex flex-col">
          <label htmlFor="name" className={labelBaseStyles()}>
            Nombre de usuario:
          </label>
          <div className="flex items-center">
            <input
              type="text"
              {...register("name", {
                required: {
                  value: true,
                  message: "Nombre es requerido",
                },
                minLength: {
                  value: 3,
                  message: "El nombre debe tener al menos 3 letras",
                },
              })}
              className={inputBaseStyles()}
              placeholder="Ej: Juan Perez"
              disabled={!isEditingName}
            />
            
            {/* Sección para la carrera */}
        <div className="mt-4">
          <label className={labelBaseStyles()}>
            Carrera:
          </label>
          <p className="text-slate-300">{session?.user?.major || 'No especificada'}</p>
        </div>
            <button
              type="button"
              onClick={() => {
                setIsEditingName(true);
                setValue("name", session?.user?.name || '');
              }}
              className="bg-blue-500 text-white p-1 rounded-lg ml-2 text-sm"
            >
              Modificar
            </button>
          </div>
          {errors.name && (
            <span className="text-red-500 text-xs mb-2">{errors.name.message}</span>
          )}

          <label htmlFor="email" className={labelBaseStyles()}>
            Correo:
          </label>
          <div className="flex items-center">
            <input
              type="email"
              {...register("email", {
                required: {
                  value: true,
                  message: "Correo es requerido",
                },
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Formato de correo inválido",
                },
              })}
              value={isEditingEmail ? undefined : session?.user?.email}
              disabled={!isEditingEmail}
              className={inputBaseStyles()}
              placeholder="Ej: user@gmail.com"
            />
            <button
              type="button"
              onClick={() => {
                setIsEditingEmail(true);
                setValue("email", session?.user?.email || '');
              }}
              className="bg-blue-500 text-white p-1 rounded-lg ml-2 text-sm"
            >
              Modificar
            </button>
          </div>
          {errors.email && (
            <span className="text-red-500 text-xs mb-2">{errors.email.message}</span>
          )}

          <button
            type="button"
            onClick={() => setIsEditingPassword(!isEditingPassword)}
            className="bg-blue-500 text-white p-1 rounded-lg mt-4"
          >
            {isEditingPassword ? "Cancelar Cambiar Contraseña" : "Cambiar Contraseña"}
          </button>

          {isEditingPassword && (
            <>
              <label htmlFor="password" className={labelBaseStyles()}>
                Nueva Contraseña:
              </label>
              <input
                type={showPassword ? "text" : "password"} // Cambia el tipo de entrada
                {...register("password", {
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
                className={inputBaseStyles()}
                placeholder="Nueva contraseña"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
              {errors.password && (
                <span className="text-red-500 text-xs mb-2">{errors.password.message}</span>
              )}

              <label htmlFor="confirmPassword" className={labelBaseStyles()}>
                Confirmar Contraseña:
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"} // Cambia el tipo de entrada
                {...register("confirmPassword", {
                  validate: value =>
                    value === getValues('password') || "Las contraseñas no coinciden",
                })}
                className={inputBaseStyles()}
                placeholder="Confirmar contraseña"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? "Ocultar" : "Mostrar"}
              </button>
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs mb-2">{errors.confirmPassword.message}</span>
              )}
            </>
          )}

          <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2">
            Actualizar Perfil
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
