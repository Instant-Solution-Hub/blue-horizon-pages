import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

export const fetchMonthlyProductSales = async (feId: number) => {
  const res = await API.get("/fe/monthly-sales", {
    params: { feId },
  });
  return res.data;
};

export const updateMonthlyProductSales = async (
  feId: number,
  productId: number,
  quantity: number
) => {
    console.log(feId + " "+ productId + " " + quantity);
  const res = await API.put(
    "/fe/monthly-sales",
    { productId, quantity, feId }
  );
  return res.data;
};


export const getMonthlyMarketSales = async (
  feId: number
) => {

  const res = await API.get(`/fe/market-sales/${feId}/current-month`);
  console.log(res);
  return res.data;
};

export const updateMarketSales = async (
  feId: number,
  payload: {
    market: string;
    salesAmount: number;
  }
) => {
  const res = await API.put(`/fe/market-sales/${feId}`, payload);
  console.log(res);
  return res.data;
};
