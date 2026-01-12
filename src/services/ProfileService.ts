import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface FEProfileStats {
  targetAchieved: number;
  targetSet: number;
  casualLeaves: number;
  approvedCasualLeaves: number;
  sickLeaves: number;
  approvedSickLeaves: number;
}

export const fetchFEProfileStats = async (
  feId: number
): Promise<FEProfileStats> => {
  const { data } = await API.get(
    `/field-executives/${feId}/profile-stats`
  );
  console.log(data);
  return data;
};
