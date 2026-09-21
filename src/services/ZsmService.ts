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

export const fetchTodaysAndMissedVisits = async (zsmId: number) => {
  const response = await API.get(`/zsm-visits/today-scheduled-and-missed?zsmId=${zsmId}`, { 
    headers: {
        "Content-Type": "application/json", 
        "Accept": "application/json",
    },
  });
    return response.data;
}

export const fetchCompletedVisits = async (zsmId: number) => {
  const response = await API.get(`/zsm-visits/completed-visits?zsmId=${zsmId}`, { 
    headers: {
        "Content-Type": "application/json", 
        "Accept": "application/json", 
    },
  });
    return response.data;
}

export const fetchMissedVisits = async (zsmId: number) => {
  const response = await API.get(`/zsm-visits/missed-visits?zsmId=${zsmId}`, { 
    headers: {
        "Content-Type": "application/json", 
        "Accept": "application/json", 
    },
  });
    return response.data;
}


export const markVisit = async (visitData: any) => {
  const response = await API.post(`/zsm-visits/mark`, visitData, {
    headers: {    
        "Content-Type": "application/json", 
        "Accept": "application/json", 
    },
  });
    return response.data;
}

export const reMarkVisit = async (visitData: any) => {
  const response = await API.post(`/zsm-visits/re-mark`, visitData, {
    headers: {    
        "Content-Type": "application/json", 
        "Accept": "application/json", 
    },
  });
    return response.data;
}

export const createUnscheduledVisit = async (visitData: any) => {
  const response = await API.post(`/zsm-visits/create-unscheduled`, visitData, {
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
  });
    return response.data;
}

export const requestNewFieldExecutive = async (payload: {
  zsmId: number;
  requestedFieldExecutiveId: number;
  currentFieldExecutiveId?: number;
  weekNumber: number;
  dayOfWeek: number;
  reason: string;
}) => {
  const response = await API.post("/zsm-visits/request-new-fe", payload);
  return response.data;
};

export const fetchMyFeRequests = async (zsmId: number) => {
  const response = await API.get(`/zsm-visits/fe-requests?zsmId=${zsmId}`);
  return response.data.data;
};

export const cancelFeRequest = async (requestId: number, zsmId: number) => {
  const response = await API.post(
    `/zsm-visits/fe-requests/cancel/${requestId}?zsmId=${zsmId}`
  );
  return response.data;
};