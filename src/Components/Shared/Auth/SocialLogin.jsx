import { toast } from "react-toastify";
import useAxios from "../../../Hooks/useAxios";
import useAuth from "../../../Hooks/useAuth";
import { FcGoogle } from "react-icons/fc";

const SocialLogin = ({ message }) => {
  const axiosInstance = useAxios();
  const { continueWithGoogle } = useAuth();

  const handleGoogleLogin = () => {
    continueWithGoogle()
      .then(async (res) => {
        const email = res.user?.providerData[0]?.email;

        const userInfo = {
          email,
          providerId: res.providerId,
          name: res.user.displayName,
          role: "customer",
          photo: res.user.photoURL,
          createdAt: res.user.metadata.createdAt,
          last_log_in: Date.now().toString(),
        };

        await axiosInstance.post("/users", userInfo);
        toast.success(message);
      })
      .catch((error) => toast.error(error.message));
  };

  return (
    <>
      {/* Google */}
      <button onClick={handleGoogleLogin} className="btn w-full">
        <FcGoogle className="h-6.5 w-6.5" />
        Continue with Google
      </button>
    </>
  );
};

export default SocialLogin;