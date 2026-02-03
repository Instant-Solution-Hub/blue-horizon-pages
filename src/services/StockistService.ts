import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Stockist {
  id: number;
  name: string;
  marketName: string;
}

export interface StockRequest {
  managerId: number;
  stockistId: number;
  productId: number;
  quantity: number;
}

export interface StockResponse {
  id: number;
  productId: number;
  stockistId: number;
  quantity: number;
}
export interface BackendStock {
  id: number;
  stockistId: number;
  stockistName: string;
  productId: number;
  productName: string;
  availableQuantity: number;
}

export const getStockistsByManager = async (
  managerId: number
): Promise<Stockist[]> => {
  const res = await API.get(`/stockists/manager/${managerId}`);
  console.log(res);
  return res.data.data;
};

export const addStock = async (payload: StockRequest) => {
  const res = await API.post("/stockists/add-stock", payload);
  return res.data.data;
};

export const updateStock = async (payload: StockRequest) => {
  const res = await API.put("/stockists/update-stock", payload);
  console.log(res);
  return res.data.data;
};

export const deleteStock = async (
  managerId: number,
  stockistId: number,
  productId: number
) => {
  await API.delete("/stockists/delete-stock", {
    params: { managerId, stockistId, productId },
  });
};


export const getStocksByManager = async (
  managerId: number
): Promise<BackendStock[]> => {
  const res = await API.get(
    `/stockists/manager/${managerId}/stocks`
  );
  console.log(res);

  return res.data.data;
};


