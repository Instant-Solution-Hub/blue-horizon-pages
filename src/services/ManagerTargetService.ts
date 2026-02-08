import axios from "axios"

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});



export const getFEMonthlyTargets = async (
  managerId: number,
  month: number,
  year: number
) => {
  const res = await API.get(
    `/field-executives/${managerId}/fe-targets`,
    { params: { month, year } }
  );
  console.log(res);
  return res.data.data;
};

export const assignMonthlyTarget = async (
  feId: string,
  payload: {
    month: number;
    year: number;
    primaryTargetSet: number;
    secondaryTargetSet: number;
  }
) => {
  const res = await API.put(`/field-executives/${feId}/targets/monthly`, payload);
  console.log(res);
  return res.data.data; // FETargetResponseDto
};

export const getTerritoryTargets = async (
  managerId: number,
  month: number,
  year: number
) => {
  const res = await API.get(
    `/managers/${managerId}/territory-targets`,
    {
      params: { month, year },
    }
  );
  console.log(res);
  return res.data.data;
};

export const updateTerritoryTarget = async (
  territoryTargetId: number,
  payload: {
    primaryTargetAchieved?: number;
    secondaryTargetAchieved?: number;
    subStockistStock?: number;
  }
) => {
  const res = await API.put(
    `managers/territory-targets/${territoryTargetId}`,
    payload
  );
  console.log(res);
  return res.data.data;
};

export const getTerritoryOverview = async (
  month: number,
  year: number
) => {
  const res = await API.get(
    `/managers/territories/overview`,
    {
      params: { month, year },
    }
  );

  console.log(res);
  return res.data.data;
};


