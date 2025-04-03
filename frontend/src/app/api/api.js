import axios from "axios";

export const api = axios.create({
  baseURL: "https://virtual-deal-room-pegz.onrender.com/api",
  withCredentials: true,
});
