import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createLiquidationPlan = async (
  feId: number,
  payload: {
    productId: number;
    doctorId: number;
    marketName: string;
    medicalShopName?: string;
    targetLiquidation: number;
    deadline: string;
    strategy?: string;
  }
) => {
    console.log("BEFORE CALL");
    console.log(payload);
    console.log(feId);
  const res = await API.post(
    `/fe/liquidation-plans`,
    payload,
    { params: { feId } }
  );
  console.log("RESULT");
  console.log(res);

  return res.data;
};

export const fetchLiquidationPlansForFE = async (feId: number) => {
  const res = await API.get("/fe/liquidation-plans", {
    params: { feId },
  });

  return res.data; // List<LiquidationPlanResponseDto>
};

export const updateLiquidationPlan = async (
  planId: string,
  feId: number,
  payload: {
    productId: number;
    doctorId: number;
    marketName: string;
    medicalShopName?: string;
    targetLiquidation: number;
    deadline: string;
    strategy?: string;
  }
) => {
  const res = await API.put(
    `/fe/liquidation-plans/${planId}`,
    payload,
    { params: { feId } }
  );
  console.log(res);

  return res.data;
};