export const SubmitButton = ({
  loading,
  loadingText,
  children,
  icon: Icon,
}) => {
  return (
    <div className="pt-6">
      <button
        className="btn w-full btn-primary text-white disabled:cursor-not-allowed disabled:text-black/50"
        disabled={loading}
        type="submit"
      >
        {loading ? (
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-primary animate-spin"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
              />
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="25"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <line
                x1="50"
                y1="50"
                x2="75"
                y2="50"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            <span>{loadingText}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5" />}
            <span>{children}</span>
          </div>
        )}
      </button>
    </div>
  );
};