import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://shopsphere-server-wzml.onrender.com",
  withCredentials: true
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;