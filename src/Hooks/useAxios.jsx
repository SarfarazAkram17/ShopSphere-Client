import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://shopsphere-sarfaraz.vercel.app",
  withCredentials: true
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;