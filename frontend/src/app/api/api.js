import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.REACT_APP_NODE_API_URL,
  withCredentials: true,
});
