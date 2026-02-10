import axios from "axios";
import { Manager } from "@/components/admin-user-management/ManagerList";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export const fetchAllFieldExecutives = async () : Promise<any[]> => {
  const res = await API.get(`/field-executives`);
  console.log(res);
  return res.data.data; // ApiResponseDto → data
}

export const fetchManagerVisitsByWeekDay = async (managerId: number, week: number, day: number) : Promise<any[]> => {
  const res = await API.post(`/manager-visits/get-all-visits-by-week-day?managerId=${managerId}&weekNumber=${week}&dayOfWeek=${day}`);
  console.log(res);
  return res.data.data; // ApiResponseDto → data
}

export const fetchFEVisitsByWeekDay = async (feId: number, week: number, day: number) : Promise<any[]> => {
  const res = await API.post(`/visit/get-all-visits-by-week-day?fieldExecutiveId=${feId}&weekNumber=${week}&dayOfWeek=${day}`);
  console.log(res);
  return res.data.data; // ApiResponseDto → data
}