import { create } from "zustand"
import { axiosInstance } from '../lib/axios.js'
import toast from "react-hot-toast"

export const usePlaylistStore = create((set, get) => ({
    playlists: [],
    currentPlaylist: null,
    isPlaylistLoading: false,
    error: null,

    createPlaylist: async (playlistData) => {
        try {
            set({ isPlaylistLoading: true })
            const res = await axiosInstance.post("/playlist/create-playlist", playlistData)
            set((state) => ({
                playlists: [...state.playlists, res.data.playlist]
            }))
            return res.data.playlist
        } catch (error) {
            if (error.response?.data?.error) {
                toast.error(error.response.data.error);
                console.log(error.response.data.error);
            } else {
                toast.error("Something went wrong");
            }
        }

    }
}))

