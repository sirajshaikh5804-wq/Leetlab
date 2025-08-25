import { create } from "zustand";
import { axiosInsntance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLoggedIn: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInsntance.get("/auth/check");
      if (!res.ok) throw new Error("Failed to authenticate user");
      // convert res to json later
      console.log("Check auth response", res.data);

      set({ authUser: res.data.user });
    } catch (error) {
      console.log("Error checking auth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigninUp: true });
    try {
      const res = await axiosInsntance.post("/auth/resgister", data);
      set({ authUser: res.data.user });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error login", error);
      toast.error("Error loggin");
    } finally {
      set({ isSigninUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggedIn: true });
    try {
      const res = await axiosInsntance.post("/auth/login", data);
      set({ authUser: res.data.user });
      toast.success(res.data.user);
    } catch (error) {
      console.log("Error login user", error);
      toast.error("Error login user");
    } finally {
      set({ isLoggedIn: false });
    }
  },
  logout: async () => {
    try {
      await axiosInsntance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logout success")
    } catch (error) {
      console.log("Error logout", error);
      toast.error("Error logout user");
    }
  },
}));
