import { AiOutlineDelete, AiOutlineUser } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";

const DeleteModal = ({ address, onConfirm, onCancel, isDeleting }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6">
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <AiOutlineDelete className="w-7 h-7" />
            Delete Address?
          </h3>
        </div>

        <div className="p-8">
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this address? This action cannot be
            undone.
          </p>

          <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-2xl mb-6 border border-slate-200">
            <div className="flex items-start gap-3 mb-3">
              <AiOutlineUser className="w-5 h-5 text-teal-500 mt-1" />
              <div>
                <p className="font-bold text-gray-800">{address.name}</p>
                <p className="text-sm text-gray-600">{address.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <HiOutlineLocationMarker className="w-5 h-5 text-teal-500 mt-1" />
              <div>
                <p className="text-gray-700">{address.address}</p>
                <p className="text-sm text-gray-600">
                  {address.region} • {address.district} • {address.thana}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;