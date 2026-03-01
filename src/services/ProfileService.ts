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
  feId: number , year : number , month : number
): Promise<FEProfileStats> => {
  const { data } = await API.get(
    `/field-executives/${feId}/profile-stats`,{

    params: {
      year,
      month,
    }
  }
  );
  console.log(data);
  return data;
};
