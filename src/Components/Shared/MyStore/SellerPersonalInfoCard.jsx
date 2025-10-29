import {
  FaBriefcase,
  FaCalendar,
  FaCheckCircle,
  FaEnvelope,
  FaPhone,
  FaRegEdit,
  FaTimesCircle,
  FaUser,
} from "react-icons/fa";

const SellerPersonalInfoCard = ({ store, handleEdit }) => {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 shadow-lg border-2 border-blue-100 rounded-2xl overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-xl">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <FaUser className="text-white" size={24} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Personal Information
          </h2>
        </div>
        <button
          onClick={() => handleEdit("personal")}
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
          <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-blue-100 hover:border-blue-300 transition-colors">
            <div className="bg-blue-100 p-2 rounded-lg mt-1">
              <FaUser className="text-blue-600" size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Full Name</p>
              <p className="font-semibold text-gray-800 text-lg">
                {store?.name || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-blue-100 hover:border-blue-300 transition-colors">
            <div className="bg-purple-100 p-2 rounded-lg mt-1">
              <FaEnvelope className="text-purple-600" size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Email Address</p>
              <p className="font-semibold text-gray-800 break-all">
                {store?.email || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-blue-100 hover:border-blue-300 transition-colors">
            <div className="bg-green-100 p-2 rounded-lg mt-1">
              <FaCalendar className="text-green-600" size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Age</p>
              <p className="font-semibold text-gray-800 text-lg">
                {store?.age || "N/A"} years
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-blue-100 hover:border-blue-300 transition-colors">
            <div className="bg-orange-100 p-2 rounded-lg mt-1">
              <FaBriefcase className="text-orange-600" size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Experience</p>
              <p className="font-semibold text-gray-800 text-lg">
                {store?.experience || "0"} years
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-blue-100 hover:border-blue-300 transition-colors">
            <div className="bg-teal-100 p-2 rounded-lg mt-1">
              <FaPhone className="text-teal-600" size={18} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Phone Number</p>
              <p className="font-semibold text-gray-800 text-lg">
                {store?.phone || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-blue-100 hover:border-blue-300 transition-colors">
            <div
              className={`${
                store?.status === "active" ? "bg-green-100" : "bg-red-100"
              } p-2 rounded-lg mt-1`}
            >
              {store?.status === "active" ? (
                <FaCheckCircle className="text-green-600" size={18} />
              ) : (
                <FaTimesCircle className="text-red-600" size={18} />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Account Status</p>
              <p
                className={`font-bold text-lg capitalize ${
                  store?.status === "active" ? "text-green-600" : "text-red-500"
                }`}
              >
                {store?.status || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPersonalInfoCard;
