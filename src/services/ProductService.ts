import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = async () => {
  const res = await API.get(`/products`);
  return res.data;
};
