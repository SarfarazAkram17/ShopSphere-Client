import MiniLoader from "../../Loader/MiniLoader";

export const SubmitButton = ({
  loading,
  loadingText,
  children,
  icon: Icon,
}) => {
  return (
    <div className="pt-6">
      <button
        className="btn w-full btn-primary text-white disabled:text-black/50"
        disabled={loading}
        type="submit"
      >
        {loading ? (
          <div className="flex items-center gap-3">
            <MiniLoader />
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
