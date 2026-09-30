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
  location?: string;
  marketName?: string;
}

export interface StockRequest {
  managerId: number;
  stockistId: number;
  productId: number;
  quantity: number;
}

export interface StockistProductStockRequest {
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

export interface FEStockRecord {
  id: number;
  fieldExecutiveId: number;
  stockistId: number;
  stockistName: string;
  productId: number;
  productName: string;
  quantity: number;
  month: string;
  marketName?: string;
}

export const getAllStockists = async (): Promise<Stockist[]> => {
  const res = await API.get("/stockists");
  const data = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];

  return data.map((stockist: any) => ({
    ...stockist,
    location: stockist.location ?? stockist.marketName ?? "",
    marketName: stockist.marketName ?? stockist.location ?? "",
  }));
};

export const getAll = async (): Promise<Stockist[]> => getAllStockists();

export const getStockistsByManager = async (
  managerId: number
): Promise<Stockist[]> => {
  const res = await API.get(`/stockists/manager/${managerId}`);
  console.log(res);
  return res.data.data;
};

export const getStockistStocksByFe = async (
  feId: number
): Promise<FEStockRecord[]> => {
  const res = await API.get(`/stockist-stocks/fe/${feId}/current-month`);
  return Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
};

export const addStockByFe = async (
  feId: number,
  payload: StockistProductStockRequest
): Promise<FEStockRecord> => {
  const res = await API.post(`/stockist-stocks/fe/${feId}`, payload);
  return res.data.data || res.data;
};

export const updateStockByFe = async (
  feId: number,
  stockId: number,
  payload: StockistProductStockRequest
): Promise<FEStockRecord> => {
  const res = await API.put(`/stockist-stocks/fe/${feId}/${stockId}`, payload);
  return res.data.data || res.data;
};

export const deleteStockByFe = async (feId: number, stockId: number) => {
  await API.delete(`/stockist-stocks/fe/${feId}/${stockId}`);
};

export const addStock = async (
  payloadOrFeId: StockRequest | number,
  maybePayload?: StockistProductStockRequest
) => {
  if (typeof payloadOrFeId === "number") {
    if (!maybePayload) {
      throw new Error("Stock payload is required for FE stock entry");
    }
    return addStockByFe(payloadOrFeId, maybePayload);
  }

  const payload = payloadOrFeId as StockRequest;
  const res = await API.post("/stockists/add-stock", payload);
  return res.data.data;
};

export const updateStock = async (
  payloadOrFeId: StockRequest | number,
  maybeStockId?: number,
  maybePayload?: StockistProductStockRequest
) => {
  if (typeof payloadOrFeId === "number") {
    if (maybeStockId === undefined || !maybePayload) {
      throw new Error("FE stock update requires stockId and payload");
    }
    return updateStockByFe(payloadOrFeId, maybeStockId, maybePayload);
  }

  const payload = payloadOrFeId as StockRequest;
  const res = await API.put("/stockists/update-stock", payload);
  console.log(res);
  return res.data.data;
};

export const deleteStock = async (
  managerIdOrFeId: number,
  stockistIdOrStockId: number,
  productId?: number,
  maybePayload?: { stockistId?: number; productId?: number; quantity?: number }
) => {
  if (productId === undefined && maybePayload === undefined) {
    return deleteStockByFe(managerIdOrFeId, stockistIdOrStockId);
  }

  if (productId !== undefined && maybePayload === undefined) {
    await API.delete("/stockists/delete-stock", {
      params: { managerId: managerIdOrFeId, stockistId: stockistIdOrStockId, productId },
    });
    return;
  }

  await deleteStockByFe(managerIdOrFeId, stockistIdOrStockId);
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


