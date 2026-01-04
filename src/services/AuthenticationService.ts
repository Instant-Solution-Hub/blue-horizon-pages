import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (email: string, password: string) => {
  const response = await API.post(`/v1/auth/login?userEmail=${email}&userPassword=${password}`, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });

  return response.data;
};

