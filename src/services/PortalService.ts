import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export const checkPortalStatus = async () => {
  const response = await axios.get(`${API_BASE}/portal/status`);
  return response.data;
};
