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


export const fetchAllFEMissedVisits = async ():Promise<any[]> => {
  const res = await API.get('/visit/get-all-missed-visits');
  return res.data;
}

export const fetchAllManagerMissedVisits = async ():Promise<any[]> => {
  const res = await API.get('/manager-visits/get-all-missed-visits');
  return res.data;
}

export const markManagerVisitAsCompleted = async (visitId):Promise<any[]> => {
  const res = await API.post(`/manager-visits/admin/mark-visit-as-completed/${visitId}`);
  return res.data.data;
}

export const markFEVisitAsCompleted = async (visitId):Promise<any[]> => {
  const res = await API.post(`/visit/admin/mark-visit-as-completed/${visitId}`);
  return res.data.data;
}