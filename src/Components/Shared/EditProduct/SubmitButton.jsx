import MiniLoader from "../../Loader/MiniLoader";

export const SubmitButton = ({ uploading, isPending, icon: Icon, label }) => {
  const isLoading = uploading || isPending;

  return (
    <div className="pt-6">
      <button
        className="btn w-full btn-primary text-white disabled:text-black/50"
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? (
          <div className="flex items-center gap-3">
            <MiniLoader />
            <span>
              {uploading ? "Uploading images..." : "Updating product..."}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5" />}
            <span>{label}</span>
          </div>
        )}
      </button>
    </div>
  );
};
