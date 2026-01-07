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
export const fetchPlannedDoctorVisits = async (fieldExecutiveId: number, weekNumber: number, dayOfWeek: string) => {
  const response = await API.get(`/visit/planned-doctor-visits?fieldExecutiveId=${fieldExecutiveId}&weekNumber=${weekNumber}&dayOfWeek=${dayOfWeek}`, { 
    headers: {
        "Content-Type": "application/json", 
        "Accept": "application/json", 
    },
  });
    return response.data;
};


export const fetchPlannedPharmacyVisits = async (fieldExecutiveId: number, weekNumber: number, dayOfWeek: string) => {
  const response = await API.get(`/visit/planned-pharmacy-visits?fieldExecutiveId=${fieldExecutiveId}&weekNumber=${weekNumber}&dayOfWeek=${dayOfWeek}`, { 
    headers: {
        "Content-Type": "application/json", 
        "Accept": "application/json", 
    },
  });
    return response.data;
};
