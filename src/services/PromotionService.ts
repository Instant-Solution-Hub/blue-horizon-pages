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

export const getAllPromotions = async (): Promise<Promotion[]> => {
  const res = await API.get("/promotions");
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
