import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// plan visit
export const planVisit = async (visitData: any) => {
  const response = await API.post(`/visit/plan/week-day`, visitData, {
    headers: { 
        "Content-Type": "application/json", 
        "Accept": "application/json", 
    },
  });
    return response.data;
};

// fetch planned visits for a field executive
export const fetchPlannedVisits = async (fieldExecutiveId: number) => {
  const response = await API.get(`/visit/planned/${fieldExecutiveId}`, { 
    headers: {
        "Content-Type": "application/json", 
        "Accept": "application/json", 
    },
  });
    return response.data;
};
