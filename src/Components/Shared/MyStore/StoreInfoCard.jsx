import {
  FaCheckCircle,
  FaCreditCard,
  FaMapMarkerAlt,
  FaRegEdit,
  FaStore,
  FaTags,
  FaTimesCircle,
} from "react-icons/fa";

const StoreInfoCard = ({ store, handleEdit }) => {
  return (
    <div className="bg-gradient-to-br from-white to-purple-50 shadow-lg border-2 border-purple-100 rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-xl">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <FaStore className="text-white" size={24} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Store Information</h2>
        </div>
        <button
          onClick={() => handleEdit("store")}
          className="bg-white/20 hover:bg-white/30 p-3 rounded-lg transition-all duration-200 backdrop-blur-sm group cursor-pointer"
        >
          <FaRegEdit
            size={20}
            className="text-white group-hover:scale-110 transition-transform"
          />
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-purple-100 hover:border-purple-300 transition-colors">
            <div className="bg-blue-100 p-2 rounded-lg mt-1">
              <FaMapMarkerAlt className="text-blue-600" size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Store Address</p>
              <p className="font-semibold text-gray-800">
                {store?.storeAddress || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-purple-100 hover:border-purple-300 transition-colors">
            <div className="bg-indigo-100 p-2 rounded-lg mt-1">
              <FaMapMarkerAlt className="text-indigo-600" size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Region</p>
              <p className="font-semibold text-gray-800">
                {store?.region || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-purple-100 hover:border-purple-300 transition-colors">
            <div className="bg-purple-100 p-2 rounded-lg mt-1">
              <FaMapMarkerAlt className="text-purple-600" size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">District</p>
              <p className="font-semibold text-gray-800">
                {store?.district || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-purple-100 hover:border-purple-300 transition-colors">
            <div className="bg-pink-100 p-2 rounded-lg mt-1">
              <FaMapMarkerAlt className="text-pink-600" size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Thana</p>
              <p className="font-semibold text-gray-800">
                {store?.thana || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-purple-100 hover:border-purple-300 transition-colors">
            <div className="bg-yellow-100 p-2 rounded-lg mt-1">
              <FaStore className="text-yellow-600" size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Store Name</p>
              <p className="font-semibold text-gray-800">
                {store?.storeName || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-purple-100 hover:border-purple-300 transition-colors">
            <div className="bg-green-100 p-2 rounded-lg mt-1">
              <FaCreditCard className="text-green-600" size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-500 mb-1">Stripe Account ID</p>
              <p className="font-semibold text-gray-800 truncate">
                {store?.stripeAccountId || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-purple-100 hover:border-purple-300 transition-colors">
            <div className="bg-orange-100 p-2 rounded-lg mt-1">
              <FaTags className="text-orange-600" size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Categories</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {store?.categories?.map((cat, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-full capitalize"
                  >
                    {cat}
                  </span>
                )) || <span className="text-gray-500">None</span>}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-purple-100 hover:border-purple-300 transition-colors">
            <div
              className={`${
                store?.work_status === "available"
                  ? "bg-green-100"
                  : "bg-red-100"
              } p-2 rounded-lg mt-1`}
            >
              {store?.work_status === "available" ? (
                <FaCheckCircle className="text-green-600" size={18} />
              ) : (
                <FaTimesCircle className="text-red-600" size={18} />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Work Status</p>
              <p
                className={`font-bold text-lg capitalize ${
                  store?.work_status === "available"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {store?.work_status || "N/A"}
              </p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl shadow-sm border border-purple-100 hover:border-purple-300 transition-colors">
            <p className="text-sm text-gray-500 mb-3 font-medium">Store Logo</p>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 flex items-center justify-center border-2 border-dashed border-gray-300">
              <img
                src={store?.storeLogo}
                alt="Store Logo"
                className="w-auto h-36 object-contain rounded"
              />
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl shadow-sm border border-purple-100 hover:border-purple-300 transition-colors">
            <p className="text-sm text-gray-500 mb-3 font-medium">
              Cover Image
            </p>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
              <img
                src={store?.coverImage}
                alt="Cover"
                className="w-full h-42"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreInfoCard;