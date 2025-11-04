import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaLock,
  FaCamera,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaUserPlus,
} from "react-icons/fa";
import userImage from "../../assets/images/image-upload-icon.png";
import axios from "axios";
import SocialLogin from "../../Components/Shared/Auth/SocialLogin";
import useAuth from "../../Hooks/useAuth";
import Lottie from "lottie-react";
import registerLottie from "../../assets/animations/register.json";
import MiniLoader from "../../Components/Loader/MiniLoader";

const Register = () => {
  const { createUser, updateUserProfile, sendVerificationEmail, logOutUser } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
    watch,
  } = useForm();

  const password = watch("password") || "";

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      clearErrors("photo");
    } else {
      setSelectedFile(null);
      setPreview(null);
    }
  };

  const validatePassword = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    };
    return checks;
  };

  const passwordChecks = validatePassword(password);

  const handleRegister = async (data) => {
    setLoading(true);
    const { name, email, password } = data;

    // Upload image to Cloudinary
    const imageData = new FormData();
    imageData.append("file", selectedFile);
    imageData.append(
      "upload_preset",
      import.meta.env.VITE_cloudinary_preset_name
    );

    try {
      const imageRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_cloudinary_cloud_name
        }/image/upload`,
        imageData
      );

      const imageUrl = imageRes.data.secure_url;

      // Register user
      await createUser(email, password);

      const userProfile = {
        displayName: name.trim(),
        photoURL: imageUrl,
      };

      await updateUserProfile(userProfile);
      await sendVerificationEmail();
      await logOutUser();

      toast.success(
        "Registered successful. Now check email and verify yourself then login and also check email in spam folder"
      );
      reset();
      setPreview(null);
      setSelectedFile(null);
      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 bg-gradient-to-br from-primary/5 via-transparent to-primary/10">
      <div className="flex flex-col lg:flex-row max-w-[1500px] w-full gap-8 items-center justify-center">
        {/* Lottie Animation Section */}
        <div className="flex-1 w-full max-w-xl">
          <Lottie
            className="w-full h-auto"
            animationData={registerLottie}
            loop={true}
          />
        </div>

        {/* Register Form Section */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <FaUserPlus className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                Create Your Account
              </h1>
              <p className="text-gray-600 font-medium">Join ShopSphere today</p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit(handleRegister)} className="space-y-5">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center">
                <label
                  htmlFor="profileImage"
                  className="relative cursor-pointer group"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/30 group-hover:border-primary transition-all">
                    <img
                      src={preview || userImage}
                      alt="Upload"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <FaCamera className="w-4 h-4 text-white" />
                  </div>
                </label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  {...register("photo", { required: true })}
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Upload your profile picture
                </p>
                {errors.photo && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FaExclamationTriangle className="w-4 h-4" />
                    Profile image is required
                  </p>
                )}
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaUser className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    {...register("name", { required: true, minLength: 4 })}
                    className={`w-full pl-11 pr-4 py-3 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-primary/60 focus:border-transparent outline-none transition`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FaExclamationTriangle className="w-4 h-4" />
                    {errors.name.type === "required"
                      ? "Name is required"
                      : "Name must be at least 4 characters"}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaEnvelope className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    className={`w-full pl-11 pr-4 py-3 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-primary/60 focus:border-transparent outline-none transition`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FaExclamationTriangle className="w-4 h-4" />
                    Email is required
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaLock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full pl-11 pr-12 py-3 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-primary/60 focus:border-transparent outline-none transition`}
                    placeholder="Enter your password"
                    {...register("password", {
                      required: true,
                      minLength: 8,
                      validate: {
                        hasUppercase: (value) =>
                          /[A-Z]/.test(value) ||
                          "Must include at least one uppercase letter",
                        hasLowercase: (value) =>
                          /[a-z]/.test(value) ||
                          "Must include at least one lowercase letter",
                        hasNumber: (value) =>
                          /\d/.test(value) ||
                          "Must include at least one number",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-5 h-5 cursor-pointer" />
                    ) : (
                      <FaEye className="w-5 h-5 cursor-pointer" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FaExclamationTriangle className="w-4 h-4" />
                    {errors.password.message ||
                      (errors.password.type === "minLength"
                        ? "Password must be at least 6 characters"
                        : "Password is required")}
                  </p>
                )}

                {/* Password Requirements */}
                {password && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      Password Requirements:
                    </p>
                    <div className="space-y-1.5">
                      <div
                        className={`flex items-center gap-2 text-xs ${
                          passwordChecks.length
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {passwordChecks.length ? (
                          <FaCheckCircle className="w-4 h-4" />
                        ) : (
                          <FaTimesCircle className="w-4 h-4" />
                        )}
                        At least 8 characters
                      </div>
                      <div
                        className={`flex items-center gap-2 text-xs ${
                          passwordChecks.uppercase
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {passwordChecks.uppercase ? (
                          <FaCheckCircle className="w-4 h-4" />
                        ) : (
                          <FaTimesCircle className="w-4 h-4" />
                        )}
                        One uppercase letter
                      </div>
                      <div
                        className={`flex items-center gap-2 text-xs ${
                          passwordChecks.lowercase
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {passwordChecks.lowercase ? (
                          <FaCheckCircle className="w-4 h-4" />
                        ) : (
                          <FaTimesCircle className="w-4 h-4" />
                        )}
                        One lowercase letter
                      </div>
                      <div
                        className={`flex items-center gap-2 text-xs ${
                          passwordChecks.number
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {passwordChecks.number ? (
                          <FaCheckCircle className="w-4 h-4" />
                        ) : (
                          <FaTimesCircle className="w-4 h-4" />
                        )}
                        One number
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary text-white disabled:text-black/50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <MiniLoader />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="w-5 h-5" />
                    <span>Create Account</span>
                  </>
                )}
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  state={location.state}
                  to="/login"
                  className="text-primary hover:text-primary/80 font-semibold transition"
                >
                  Login now
                </Link>
              </p>
            </form>

            {/* Divider */}
            <div className="divider my-6">Or continue with</div>

            {/* Social Login */}
            <SocialLogin
              message="You registered successful"
              state={location.state}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;