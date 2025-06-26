import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const userApi = axios.create({
  baseURL: `${API_URL}/user`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default userApi;
