// src/plugins/axios.js
import axios from "axios";
import store from "@/store";

const apiClient = axios.create({
  baseURL: "http://localhost:5001", // Mock server URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token
apiClient.interceptors.request.use(
  (config) => {
    const token = store.state.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
