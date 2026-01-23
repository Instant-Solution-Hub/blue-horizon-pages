import axios from "axios";
import { FEProductStock } from "@/components/stock-liquidation/AddLiquidationModal";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
export interface UpdateProductStockRequest {
  feId: number;
  productId: number;
  newAllocatedQuantity: number;
}

export const updateProductStock = async (
  payload: UpdateProductStockRequest
) => {
  console.log(payload);

  const res = await API.put(
    "/field-executives/update-product-stock",
    payload
  );
  console.log(res);
  return res.data.data; // FEProductAllocationResponseDto
};


export const getAllocatedProducts = async (
  feId: number
): Promise<FEProductStock[]> => {
  const res = await API.get(
    `/field-executives/${feId}/products`
  );
  console.log(res);
  return res.data.data;
};

export const getFEProductStock = async (
  feId: number,
  productId: number
): Promise<FEProductStock> => {
  const res = await API.get(
    `/field-executives/${feId}/products/${productId}/stock`
  );
  return res.data.data;
};