import axios from "axios";

export const axiosInsntance = axios.create({
  baseURL:
    import.meta.env.MODE === "developement"
      ? "http://localhost:8081/api/v1"
      : "/api/v1",
  withCredentials: true,
});
