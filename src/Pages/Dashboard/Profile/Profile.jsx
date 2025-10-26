import { useState, useEffect } from "react";
import {
  FiX,
  FiEdit2,
  FiMail,
  FiUser,
  FiShield,
  FiCamera,
  FiCheck,
} from "react-icons/fi";
import { toast } from "react-toastify";
import useAuth from "../../../Hooks/useAuth";
import useUserRole from "../../../Hooks/useUserRole";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const Profile = () => {
  const axiosSecure = useAxiosSecure();
  const { user, userEmail, updateUserProfile } = useAuth();
  const { role, roleLoading } = useUserRole();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageHover, setImageHover] = useState(false);

  useEffect(() => {
    if (user?.photoURL && !preview) {
      setPreview(user.photoURL);
    }
  }, [user?.photoURL, preview]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleEditClick = () => {
    setFormData({ name: user?.displayName || "" });
    setPreview(user?.photoURL || null);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    document.getElementById("profileImage").click();
  };

  const handleUpdate = async () => {
    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      toast.error("Name cannot be empty");
      return;
    }

    if (!preview) {
      toast.error("Please select a profile image");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = user.photoURL;
      let nameToUpdate = user.displayName;

      if (selectedFile) {
        const imageData = new FormData();
        imageData.append("file", selectedFile);
        imageData.append(
          "upload_preset",
          import.meta.env.VITE_cloudinary_preset_name
        );

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_cloudinary_cloud_name
          }/image/upload`,
          {
            method: "POST",
            body: imageData,
          }
        );

        const data = await res.json();
        imageUrl = data.secure_url;
      }

      if (trimmedName !== user.displayName) {
        nameToUpdate = trimmedName;
      }

      await updateUserProfile({
        displayName: nameToUpdate,
        photoURL: imageUrl,
      });

      await axiosSecure.patch(`/users?email=${userEmail}`, {
        name: nameToUpdate,
        photo: imageUrl,
      });

      toast.success("Profile updated successfully");
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const isSaveDisabled =
    formData.name.trim() === user?.displayName && preview === user?.photoURL;

  const getRoleBadgeColor = (userRole) => {
    const colors = {
      admin: "bg-gradient-to-r from-purple-500 to-pink-500",
      customer: "bg-gradient-to-r from-green-500 to-emerald-500",
      rider: "bg-gradient-to-r from-orange-500 to-red-500",
      seller: "bg-gradient-to-r from-yellow-500 to-orange-500",
    };
    return (
      colors[userRole?.toLowerCase()] ||
      "bg-gradient-to-r from-gray-500 to-gray-600"
    );
  };

  return (
    <div className="px-4">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 bg-gradient-to-b from-primary to-purple-600 rounded-full"></div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            My Profile
          </h2>
        </div>
        <p className="text-gray-600 ml-6 text-lg">
          Welcome back, {user?.displayName} 👋
        </p>
      </div>

      {/* Main Profile Card */}
      <div>
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header Background */}
          <div className="h-40 bg-gradient-to-r from-primary via-purple-600 to-pink-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>

          {/* Profile Content */}
          <div className="relative px-6 md:px-12 pb-12">
            {/* Profile Image */}
            <div className="flex flex-col md:flex-row md:items-end gap-8 -mt-20 mb-8">
              <div className="relative group">
                <div className="w-40 h-40 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white">
                  <img
                    src={user?.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* User Info */}
              <div className="flex-1 md:mb-4 mt-8">
                <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {user?.displayName}
                </h3>
                <p className="text-gray-600 my-3">{userEmail}</p>
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold ${getRoleBadgeColor(
                    role
                  )}`}
                >
                  <FiShield className="w-4 h-4" />
                  {!roleLoading && <span className="capitalize">{role}</span>}
                </span>
              </div>

              {/* Edit Button */}
              <button
                onClick={handleEditClick}
                className="md:mb-4 group relative cursor-pointer overflow-hidden bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <FiEdit2 className="w-5 h-5" />
                  Edit Profile
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Info Cards Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Name Card */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                    <FiUser className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-700">Full Name</h4>
                </div>
                <p className="text-gray-800 font-medium text-lg ml-15">
                  {user?.displayName}
                </p>
              </div>

              {/* Email Card */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                    <FiMail className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-700">Email Address</h4>
                </div>
                <p className="text-gray-800 font-medium text-sm ml-15 break-all">
                  {userEmail}
                </p>
              </div>

              {/* Role Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                    <FiShield className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-700">User Role</h4>
                </div>
                <p className="text-gray-800 font-medium text-lg ml-15 capitalize">
                  {!roleLoading && role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => !loading && setIsModalOpen(false)}
          ></div>

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-h-[95vh] overflow-y-auto max-w-xl hide-scrollbar w-full p-8 relative shadow-2xl transform transition-all duration-300 scale-100 opacity-100">
              <button
                onClick={() => !loading && setIsModalOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-500 hover:text-white text-gray-600 transition-all duration-300 cursor-pointer"
                aria-label="Close modal"
                disabled={loading}
              >
                <FiX size={20} />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <FiEdit2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">
                  Edit Profile
                </h3>
                <p className="text-gray-600 mt-2">
                  Update your profile information
                </p>
              </div>

              {/* Profile Image Section */}
              <div className="flex flex-col items-center mb-6">
                <div
                  className="relative group mb-4 cursor-pointer"
                  onMouseEnter={() => setImageHover(true)}
                  onMouseLeave={() => setImageHover(false)}
                  onClick={handleImageClick}
                >
                  <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-primary shadow-lg">
                    <img
                      src={preview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className={`absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center transition-opacity duration-300 ${
                      imageHover ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <FiCamera className="w-8 h-8 text-white" />
                  </div>
                </div>

                <button
                  onClick={() =>
                    document.getElementById("profileImage").click()
                  }
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <FiCamera className="w-5 h-5" />
                  Change Photo
                </button>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {!preview && (
                  <p className="text-red-500 text-sm font-semibold mt-3 bg-red-50 px-4 py-2 rounded-lg">
                    Profile image is required
                  </p>
                )}
              </div>

              {/* Name Input */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-3">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>
                {!formData.name.trim() && (
                  <p className="text-red-500 text-sm font-semibold mt-2 bg-red-50 px-4 py-2 rounded-lg">
                    Name is required
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => !loading && setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary text-white disabled:text-black py-4 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  disabled={
                    loading ||
                    !formData.name.trim() ||
                    !preview ||
                    isSaveDisabled
                  }
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 animate-spin"
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
                      <span>Updating...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;