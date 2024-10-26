// src/store/index.js
import { createStore } from "vuex";
import apiClient from "@/plugins/axios";

export default createStore({
  state: {
    token: localStorage.getItem("token") || "",
    user: JSON.parse(localStorage.getItem("user")) || {},
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    setUser(state, user) {
      state.user = user;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userType", user.type); // Store user type
    },
    logout(state) {
      state.token = "";
      state.user = {};
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userType"); // Remove user type
    },
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await apiClient.post("/auth/login", credentials);
        const token = response.data.token;
        const user = response.data.user;
        localStorage.setItem("token", token);
        commit("setToken", token);
        commit("setUser", user);
      } catch (error) {
        console.error(
          "Login error:",
          error.response?.data?.message || error.message
        );
        throw error;
      }
    },
    logout({ commit }) {
      commit("logout");
    },
    async fetchUser({ commit, state }) {
      try {
        const response = await apiClient.get(
          "http://localhost:5000/api/auth/user",
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );
        commit("setUser", response.data);
      } catch (error) {
        console.error("Fetch user error:", error);
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    userType: (state) => state.user.type,
    userName: (state) => `${state.user.firstname} ${state.user.lastname}`,
  },
});
