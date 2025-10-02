import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { EraserIcon } from "lucide-react";

export const useProblemStore = create((set, get) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,
  isDeletingProblem: false,

  getAllProblems: async () => {
    try {
      set({ isProblemsLoading: true });
      const res = await axiosInstance.get("/problems/get-all-problems");
      set({ problems: res.data.problems });
    } catch (error) {
      console.log("Error getting all problems", error);
      toast.error("Error in getting problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  getProblemById: async (id) => {
    try {
      set({ isProblemLoading: true });
      const res = await axiosInstance.get(`/problems/get-problem/${id}`);
      set({ problem: res.data.problem });
      toast.success(res.data.message);
    } catch (error) {
      console.log("Error getting problem By Id", error);
      toast.error("Error in getting problem by Id");
    } finally {
      set({ isProblemLoading: false });
    }
  },

  getSolvedProblemByUser: async () => {
    try {
      const res = await axiosInstance.get("/problems/get-solved-problem");
      set({ solvedProblems: res.data.problems });
    } catch (error) {
      console.log("Error getting Solved Problems", error);
      toast.error("Error getting Solved Problems");
    }
  },

  // Method to remove problem from local state
  deleteProblem: async (id) => {
    try {
      //remove problem from UI immediately
      set((state) => ({
        problems: state.problems.filter(problem => problem.id !== id)
      }))

      set({ isDeletingProblem: true })
      const res = await axiosInstance.delete(`problems/delete-problem/${id}`)
      toast.success("Problem Deleted")

    } catch (error) {
      console.log("Error Deleting Problem", error);
      toast.error("Failed to delete problem");

      // Rollback: restore the problem if API fails
      get().getAllProblems();
    } finally {
      set({ isDeletingProblem: false })
    }
  },

}));