import { FaMotorcycle } from "react-icons/fa";
import MiniLoader from "../../Loader/MiniLoader";

export const SubmitButton = ({ submitting }) => (
  <div className="pt-6">
    <button
      type="submit"
      className="btn w-full btn-primary text-white disabled:text-black/50 disabled:cursor-not-allowed"
      disabled={submitting}
    >
      {submitting ? (
        <div className="flex items-center gap-3">
          <MiniLoader />
          <span>Submitting Application...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <FaMotorcycle className="w-5 h-5" />
          <span>Submit Application</span>
        </div>
      )}
    </button>
  </div>
);

export default SubmitButton;