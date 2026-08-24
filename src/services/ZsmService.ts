import axios from "axios";
import { Manager } from "@/components/admin-user-management/ManagerList";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchPriorityFieldExecutives = async (week: number, day: number) => {
  const response = await API.get(`/field-executives/zsm/a-priority-field-executives?weekNumber=${week}&dayOfWeek=${day}`, { 
    headers: {
        "Content-Type": "application/json", 
        "Accept": "application/json",
    },
  });
    return response.data;
}

export const assignZsmToFieldExecutive = async (obj:any ) => {
  const response = await API.post(`/zsm-visits/assign`, obj, { 
    headers: {  
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
  });
    return response.data;
}

export const unAssignZsmFromFieldExecutive = async (obj:any ) => {
  const response = await API.post(`/zsm-visits/unassign`, obj, { 
    headers: {  
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
  });
    return response.data;
}

export const fetchAllCurrentMonthVisits = async (zsmId: number, week: number, day: number) => {
  const response = await API.post(`/zsm-visits/get-current-month-visits?zsmId=${zsmId}&weekNumber=${week}&dayOfWeek=${day}`, {
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json", 
    },
  });
    return response.data;
}

export const fetchZsmVisitReport = async (zsmId: number, fromDate: any, toDate: any, status: string, category: string, docType: string) => {
  const response = await API.get(`/zsm-visits/reports?zsmId=${zsmId}&from=${fromDate}&to=${toDate}&status=${status}&category=${category}&docType=${docType}`, {
    headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json", 
    },
  });
    return response.data;
}

export const exportZsmVisits = async (obj: any) => {
  const response = await API.post(`/visits/export/zsm/excel`, obj,  {
    responseType: "blob",
    headers: {    
        "Content-Type": "application/json", 
        "Accept": "application/json", 
    },
  });
    return response.data;
}