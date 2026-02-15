import axios from "axios";

export interface AdminProfileStats {
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

export const fetchAdminProfileStats = async (
  adminId: number
): Promise<AdminProfileStats> => {
  const { data } = await API.get(
    `/admin/${adminId}/dashboard-stats`
  );
  console.log(data);
  return data.data;
};

export const fetchUserCounts = async ():Promise<any> => {
  const response = await API.get('/admin/counts');
  return response.data;
}


