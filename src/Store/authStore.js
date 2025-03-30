import { create } from "zustand";
import axios from "axios";

// Define API Base URL
const BASE_URL = "https://tms-backend-len7v0f23-devhanzalas-projects.vercel.app";

export const useAuthStore = create((set) => ({
  user: null,
  role: null,
  loading: false,
  error: null,

  login: async (stakeholder, credentials) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        stakeholder,
        ...credentials,
      });

      // Ensure user data is properly structured
      const userData = response.data.user || {};
      const role = userData.role || (stakeholder === "hr" ? "hr" : "superadmin");

      set({
        user: { ...userData },
        role,
        loading: false,
      });

      return true;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      set({ 
        error: error.response?.data?.message || "Login failed", 
        loading: false 
      });

      return false;
    }
  },

  logout: () => set({ user: null, role: null, error: null }),

  isAuthenticated: () => {
    const state = useAuthStore.getState();
    return !!state.user;
  },
}));
