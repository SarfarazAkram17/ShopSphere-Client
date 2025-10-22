import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { useQueryClient } from "@tanstack/react-query";
import { auth } from "../../Firebase/firebase.config";
import useAxios from "../../Hooks/useAxios";

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");

const AuthProvider = ({ children }) => {
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userEmail = user?.email || user?.providerData?.[0]?.email || "";

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const updateUserProfile = (profileInfo) => {
    return updateProfile(auth.currentUser, profileInfo);
  };

  const sendVerificationEmail = () => {
    setLoading(true);
    return sendEmailVerification(auth.currentUser);
  };

  const continueWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const forgotPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const changePassword = async (currentPassword, newPassword) => {
    const user = auth.currentUser;
    const userEmail = user.email || user.providerData[0].email;

    if (!user || !userEmail) {
      throw new Error("No user is currently logged in");
    }

    // Create credential with current password
    const credential = EmailAuthProvider.credential(userEmail, currentPassword);

    try {
      // Reauthenticate user with current password
      await reauthenticateWithCredential(user, credential);

      // If reauthentication succeeds, update password
      await updatePassword(user, newPassword);

      return { success: true };
    } catch (error) {
      // Handle specific errors
      if (error.code === "auth/invalid-credential") {
        throw new Error("Current password is incorrect");
      } else if (error.code === "auth/requires-recent-login") {
        throw new Error(
          "Please log out and log in again before changing your password"
        );
      }
      throw error;
    }
  };

  const logOutUser = async () => {
    setLoading(true);
    queryClient.clear();
    await axiosInstance.post("/auth/logout");
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        const email = currentUser.email || currentUser.providerData[0].email;
        await axiosInstance.post("/auth/jwt", {
          email,
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, [axiosInstance]);

  const authInfo = {
    user,
    userEmail,
    loading,
    createUser,
    loginUser,
    updateUserProfile,
    sendVerificationEmail,
    continueWithGoogle,
    forgotPassword,
    changePassword,
    logOutUser,
  };

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;