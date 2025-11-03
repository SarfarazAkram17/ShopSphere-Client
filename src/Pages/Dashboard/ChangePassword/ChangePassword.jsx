import { useState } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import useAuth from "../../../Hooks/useAuth";

const ChangePassword = () => {
  const { changePassword } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validatePassword = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
    };
    return checks;
  };

  const passwordChecks = validatePassword(formData.newPassword);
  const isPasswordValid = Object.values(passwordChecks).every((check) => check);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    setSuccess(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (!isPasswordValid) {
      newErrors.newPassword = "Password does not meet requirements";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await changePassword(formData.currentPassword, formData.newPassword);

      setSuccess(true);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (error.message === "Current password is incorrect") {
        setErrors({ currentPassword: "Current password is incorrect" });
      } else if (error.message.includes("log out and log in again")) {
        setErrors({
          general:
            "Please log out and log in again before changing your password",
        });
      } else {
        setErrors({
          general:
            error.message || "Failed to change password. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
            <FaLock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Change Password</h2>
          <p className="text-gray-600 mt-2">Update your account password</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <FaCheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-800 font-medium">
                Password changed successfully!
              </p>
              <p className="text-green-700 text-sm mt-1">
                Your password has been updated.
              </p>
            </div>
          </div>
        )}

        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <FaExclamationCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{errors.general}</p>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.currentPassword ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-primary/60 focus:border-transparent outline-none transition pr-12`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                {showPasswords.current ? (
                  <FaEyeSlash className="w-5 h-5 cursor-pointer" />
                ) : (
                  <FaEye className="w-5 h-5 cursor-pointer" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <FaTimesCircle className="w-4 h-4" />
                {errors.currentPassword}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-primary/60 focus:border-transparent outline-none transition pr-12`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                {showPasswords.new ? (
                  <FaEyeSlash className="w-5 h-5 cursor-pointer" />
                ) : (
                  <FaEye className="w-5 h-5 cursor-pointer" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <FaTimesCircle className="w-4 h-4" />
                {errors.newPassword}
              </p>
            )}

            {formData.newPassword && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Password Requirements:
                </p>
                <div className="space-y-1.5">
                  <div
                    className={`flex items-center gap-2 text-xs ${
                      passwordChecks.length ? "text-green-600" : "text-gray-500"
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
                      passwordChecks.number ? "text-green-600" : "text-gray-500"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-primary/60 focus:border-transparent outline-none transition pr-12`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                {showPasswords.confirm ? (
                  <FaEyeSlash className="w-5 h-5 cursor-pointer" />
                ) : (
                  <FaEye className="w-5 h-5 cursor-pointer" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <FaTimesCircle className="w-4 h-4" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
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
                </svg>{" "}
                Changing Password...
              </>
            ) : (
              "Change Password"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;