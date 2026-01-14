import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getFEProductStock = async (
  feId: number,
  productId: number
) => {
  const res = await API.get(
    `/field-executives/${feId}/products/${productId}/stock`
  );
  return res.data.data;
};