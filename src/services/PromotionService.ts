import axios from "axios"; // your axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

type ProductField = string | string[] | null | undefined;

const normalizeProductNames = (value: ProductField): string[] => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .flatMap((item) => (typeof item === "string" ? item.split(",") : []))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export interface Promotion {
  id: number;
  name: string;
  description?: string;
  product?: string | string[];
  products?: string[];
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
  products: string[];
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

export const mapPromotionApiToUi = (p: Promotion): PromotionApi => {
  const productNames = normalizeProductNames(p.product ?? p.products ?? []);

  return {
    id: String(p.id),
    name: p.name,
    description: p.description ?? "",
    productName: productNames.length > 0 ? productNames.join(", ") : "N/A",
    products: productNames,
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
  };
};
