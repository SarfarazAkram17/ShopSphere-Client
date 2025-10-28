import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAxios from "../../Hooks/useAxios";
import useAuth from "../../Hooks/useAuth";
import SocialLogin from "../../Components/Shared/Auth/SocialLogin";
import Lottie from "lottie-react";
import loginLottie from "../../assets/animations/login.json";

const Login = () => {
  const axiosInstance = useAxios();
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser, forgotPassword, logOutUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const location = useLocation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const email = watch("email")?.trim() || "";

  const handleLogin = (formData) => {
    setLoading(true);

    const email = formData.email.trim();
    const password = formData.password.trim();

    loginUser(email, password)
      .then(async (res) => {
        if (!res.user.emailVerified) {
          logOutUser().then(() => {
            toast.warn("Verify your email and then login");
          });
          return;
        }
        toast.success("You logged in successfully");
        reset();

        await axiosInstance.post("/users", {
          email,
          name: res.user.displayName,
          role: "customer",
          photo: res.user.photoURL,
          createdAt: res.user.metadata.createdAt,
          last_log_in: Date.now().toString(),
        });
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleForgotPassword = () => {
    if (!email) {
      return toast.warn("Please enter your email first.");
    }

    setForgotPasswordLoading(true);

    forgotPassword(email)
      .then(() => {
        toast.success("Password reset email sent.");
        toast.info("Also check email in the spam section");
      })
      .catch((err) => {
        toast.error(`Error in password change: ${err.message}`);
      })
      .finally(() => {
        setForgotPasswordLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 bg-gradient-to-br from-primary/5 via-transparent to-primary/10">
      <div className="flex flex-col lg:flex-row max-w-[1500px] w-full gap-8 items-center justify-center">
        {/* Lottie Animation Section */}
        <div className="flex-1 w-full max-w-xl">
          <Lottie
            className="w-full h-auto"
            animationData={loginLottie}
            loop={true}
          />
        </div>

        {/* Login Form Section */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <FaLock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 font-medium">
                Login to your ShopSphere account
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
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
                {errors.email?.type === "required" && (
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
                    {...register("password", {
                      required: true,
                    })}
                    placeholder="Enter your password"
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
                {errors.password?.type === "required" && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FaExclamationTriangle className="w-4 h-4" />
                    Password is required
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={forgotPasswordLoading}
                  className="text-sm text-primary cursor-pointer disabled:cursor-not-allowed hover:text-primary/80 font-semibold transition disabled:opacity-50"
                >
                  {forgotPasswordLoading ? "Sending..." : "Forgot password?"}
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary text-white disabled:text-black/50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
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
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="w-5 h-5" />
                    <span>Login</span>
                  </>
                )}
              </button>

              {/* Register Link */}
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  state={location.state}
                  to="/register"
                  className="text-primary hover:text-primary/80 font-semibold transition"
                >
                  Register now
                </Link>
              </p>
            </form>

            {/* Divider */}
            <div className="divider my-6">Or continue with</div>

            {/* Social Login */}
            <SocialLogin
              message={"You login successfully"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;