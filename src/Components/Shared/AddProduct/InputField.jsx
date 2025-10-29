export const InputField = ({
  icon: Icon,
  label,
  required,
  error,
  register,
  placeholder,
  type = "text",
  helperText,
  ...props
}) => {
  return (
    <div>
      <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
        {Icon && <Icon className="w-4 h-4" />}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        {...register}
        {...props}
      />
      {helperText && !error && (
        <p className="text-xs text-gray-500 mt-2">{helperText}</p>
      )}
      {error && (
        <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};