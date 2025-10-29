export const FormTextarea = ({
  label,
  icon: Icon,
  required = false,
  error,
  placeholder,
  register,
  rows = 5,
  ...props
}) => {
  return (
    <div>
      <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
        {Icon && <Icon className="w-4 h-4" />}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        placeholder={placeholder}
        className="textarea textarea-bordered w-full resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        rows={rows}
        {...register}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
          <span>⚠</span> {error.message || `${label} is required`}
        </p>
      )}
    </div>
  );
};