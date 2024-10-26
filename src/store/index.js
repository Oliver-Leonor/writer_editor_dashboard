// src/store/index.js
import { createStore } from "vuex";
import axios from "axios";

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
        const response = await axios.post(
          "http://localhost:5000/api/auth/login",
          credentials
        );
        commit("setToken", response.data.token);
        commit("setUser", response.data.user);
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    logout({ commit }) {
      commit("logout");
    },
    async fetchUser({ commit, state }) {
      try {
        const response = await axios.get(
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
