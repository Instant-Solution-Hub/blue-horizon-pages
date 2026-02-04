import axios from "axios"; // your axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export interface Promotion {
  id: number;
  name: string;
  description?: string;
  product?: string;
  targetAudience: string[];
  benefits: string[];
  type: "NEW_PRODUCT" | "CAMPAIGN" | "OFFER";
  startDate: string;
  endDate: string;
  status: "UPCOMING" | "ACTIVE" | "COMPLETED";
  active: boolean;
}

export interface PromotionRequestDto {
  name: string;
  description?: string;
  type: "NEW_PRODUCT" | "CAMPAIGN" | "OFFER";
  startDate: string;
  endDate: string;
  status: "UPCOMING" | "ACTIVE" | "COMPLETED";
  product: string;
  benefits: string[];
  targetAudience: string[];
}

export const getAllPromotions = async (): Promise<Promotion[]> => {
  const res = await API.get("/promotions");
  console.log(res);
  return res.data.data; // ApiResponseDto unwrap
};

export const addPromotion = async (payload: PromotionRequestDto): Promise<Promotion> => {
  const res = await API.post("/promotions", payload);
  console.log(res);
  return res.data.data; // ApiResponseDto unwrap
};

export const updatePromotion = async (id: number, payload: PromotionRequestDto): Promise<Promotion> => {
  const res = await API.put(`/promotions/${id}`, payload);
  console.log(res);
  return res.data.data; // ApiResponseDto unwrap
};

export const deletePromotion = async (id: number): Promise<Promotion> => {
  const res = await API.delete(`/promotions/${id}`);
  console.log(res);
  return res.data.data; // ApiResponseDto unwrap
};

import { PromotionApi } from "@/components/promotions/PromotionList";

export const mapPromotionApiToUi = (p: Promotion): PromotionApi => ({
  id: String(p.id),
  name: p.name,
  description: p.description ?? "",
  productName: p.product ?? "N/A",
  targetAudience: p.targetAudience.join(", "),
  benefitsAndOffers: p.benefits.join(", "),
  validFrom: new Date(p.startDate),
  validTo: new Date(p.endDate),
  type:
    p.type === "NEW_PRODUCT"
      ? "New Product"
      : p.type === "OFFER"
      ? "Offer"
      : "Campaign",
  status:
    p.status === "ACTIVE"
      ? "Active"
      : p.status === "UPCOMING"
      ? "Upcoming"
      : "Expired",
});
