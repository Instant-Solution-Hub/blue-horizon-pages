import axios from "axios";

export interface ManagerProfileStats {
  targetAchieved: number;
  targetSet: number;
  casualLeaves: number;
  approvedCasualLeaves: number;
  sickLeaves: number;
  approvedSickLeaves: number;
}

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchManagerProfileStats = async (
  managerId: number
): Promise<ManagerProfileStats> => {
  const { data } = await API.get(
    `/managers/${managerId}/profile-stats`
  );
  console.log(data);
  return data;
};


