import axios from "axios";
import { POBOrder } from "@/components/pob/POBList";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createPOBOrder = async (feId: number, data: any) => {
  const res = await API.post(`/fe/orders?feId=${feId}`, data);
  return res.data;
};

export const getPOBOrders = async (feId: number) => {
  const res = await API.get(`/fe/orders/${feId}/current-month`);
  return res.data;
};

export const updatePOBOrder = async (
  feId: number,
  orderId: number,
  data: any
) => {
    const res = await API.put(`/fe/orders/${orderId}`, data, {
    params: { feId },
  });
  console.log(res.data);
  return res.data;
};

export const mapOrderResponseToPOBOrder = (apiOrder: any): POBOrder => ({
  id: apiOrder.id,

  doctorName: apiOrder.contactPerson,
  hospitalName: apiOrder.institutionName,

  orderDate: new Date(apiOrder.orderDate),
  createdAt: new Date(apiOrder.createdAt),

  products: apiOrder.items.map((item: any) => ({
    id: item.productId,
    productName: item.productName,
    qty: item.quantity,
    price: item.price,
    total: item.total,
  })),

  totalValue: apiOrder.totalAmount,
  discount: apiOrder.discount,
  notes: apiOrder.notes,
  status: apiOrder.status.toLowerCase(), // backend usually sends ENUM
});


