import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE}/auth/login`, { email, password });
  return response.data;
};
