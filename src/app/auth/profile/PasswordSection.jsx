'use client';

const inputBaseStyles = () => "p-2 mb-4 rounded bg-gray-700 text-slate-100";
const labelBaseStyles = () => "text-slate-500 mb-2 block text-sm";

const PasswordSection = ({
  isEditingPassword,
  setIsEditingPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  register,
  errors,
  getValues,
}) => 
  isEditingPassword && (
    <>
      <label htmlFor="password" className={labelBaseStyles()}>
        Nueva Contraseña:
      </label>
      <input
        type={showPassword ? "text" : "password"}
        {...register("password", {
          minLength: {
            value: 6,
            message: "La contraseña debe tener al menos 6 caracteres",
          },
        })}
        className={inputBaseStyles()}
        placeholder="Nueva contraseña"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-sm text-blue-500 underline"
      >
        {showPassword ? "Ocultar" : "Mostrar"}
      </button>
      {errors.password && (
        <span className="text-red-500 text-xs mb-2">{errors.password.message}</span>
      )}
      <label htmlFor="confirmPassword" className={labelBaseStyles()}>
        Confirmar Contraseña:
      </label>
      <input
        type={showConfirmPassword ? "text" : "password"}
        {...register("confirmPassword", {
          validate: (value) =>
            value === getValues("password") || "Las contraseñas no coinciden",
        })}
        className={inputBaseStyles()}
        placeholder="Confirmar contraseña"
      />
      <button
        type="button"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        className="text-sm text-blue-500 underline"
      >
        {showConfirmPassword ? "Ocultar" : "Mostrar"}
      </button>
      {errors.confirmPassword && (
        <span className="text-red-500 text-xs mb-2">
          {errors.confirmPassword.message}
        </span>
      )}
    </>
  );

export default PasswordSection;
