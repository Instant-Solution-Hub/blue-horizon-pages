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

export const fetchTodaysVisits = async (fieldExecutiveId: number) => {
  const response = await API.get(`/visit/today-scheduled?fieldExecutiveId=${fieldExecutiveId}`, { 
    headers: {
        "Content-Type": "application/json", 
        "Accept": "application/json",
    },
  });
    return response.data;
}

export const markVisit = async (visitData: any) => {
  const response = await API.post(`/visit/mark`, visitData, {
    headers: {    
        "Content-Type": "application/json", 
        "Accept": "application/json", 
    },
  });
    return response.data;
}

export const reMarkVisit = async (visitData: any) => {
  const response = await API.post(`/visit/re-mark`, visitData, {
    headers: {    
        "Content-Type": "application/json", 
        "Accept": "application/json", 
    },
  });
    return response.data;
}

export const markStockistVisit = async (visitData: any) => {
  const response = await API.post(`/visit/mark-stockist`, visitData, {
    headers: {    
        "Content-Type": "application/json", 
        "Accept": "application/json", 
    },
  });
    return response.data;
}


export const fetchAllStockists = async () => {
  const response = await API.get(`/stockists`, { 
    headers: {    
        "Content-Type": "application/json",
        "Accept": "application/json", 
    },
  });
    return response.data;
}

export const fetchCompletedVisits = async (fieldExecutiveId: number) => {
  const response = await API.get(`/visit/completed-visits?fieldExecutiveId=${fieldExecutiveId}`, { 
    headers: {
        "Content-Type": "application/json", 
        "Accept": "application/json", 
    },
  });
    return response.data;
}

export const fetchMissedVisits = async (fieldExecutiveId: number) => {
  const response = await API.get(`/visit/missed-visits?fieldExecutiveId=${fieldExecutiveId}`, { 
    headers: {
        "Content-Type": "application/json", 
        "Accept": "application/json", 
    },
  });
    return response.data;
}


export const fetchAllProducts = async () => {
  const response = await API.get(`/products`, { 
    headers: {  
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
  });
    return response.data;
};


export const fetchDashboardMetrics = async (fieldExecutiveId: number) => {
  const response = await API.get(`/visit/dashboard/${fieldExecutiveId}`, { 
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
  });
    return response.data;
}

export const fetchVisitComplianceData = async (fieldExecutiveId: number, week: string) => {
  const response = await API.get(`/visit/get-compliance-record?fieldExecutiveId=${fieldExecutiveId}&week=${week}`, { 
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
  });
    return response.data;
}

export const fetchMonthlyProgressData = async (fieldExecutiveId: number, ) => {
  const response = await API.get(`/visit/monthly-doctor-progress/${fieldExecutiveId}`, { 
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
  });
    return response.data;
} 

export const deleteVisitById = async (visitId: number) => {
  const response = await API.delete(`/visit/${visitId}`, { 
    headers: {  
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
  });
    return response.data;
}


export const fetchVisits = async (managerId: number, week: number, day: number) => {
  const response = await API.get(`/visit/manager/${managerId}/scheduled-visits?weekNumber=${week}&dayOfWeek=${day}`, { 
    headers: {
        "Content-Type": "application/json", 
        "Accept": "application/json",
    },
  });
    return response.data;
}

export const assignManagerToVisit = async (visitId: number, managerId: number, managerName: string) => {
  const response = await API.post(`/visit/assign-manager/${visitId}`, {
    managerId,
    managerName
  }, { 
    headers: {
        "Content-Type": "application/json", 
        "Accept": "application/json",
    },
  });
    return response.data;
}

export const fetchPriorityFieldExecutives = async (managerId: number, week: number, day: number) => {
  const response = await API.get(`/field-executives/manager/${managerId}/a-priority-field-executives?weekNumber=${week}&dayOfWeek=${day}`, { 
    headers: {
        "Content-Type": "application/json", 
        "Accept": "application/json",
    },
  });
    return response.data;
}


export const assignManagerToFieldExecutive = async (obj:any ) => {
  const response = await API.post(`/manager-visits/assign`, obj, { 
    headers: {  
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
  });
    return response.data;
}

export const fetchManagerDashboardStats = async (managerId: number) => {
  const response = await API.get(`/managers/stats/${managerId}`, { 
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
  });
    return response.data;
}

export const fetchManagerTodaysSchedule = async (managerId: number) => {
  const response = await API.get(`/manager-visits/today-schedule/${managerId}`, { 
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",     
    },
  });
    return response.data;
}

export const fetchManagerTeamPerformance = async (managerId: number) => {
  const response = await API.get(`/managers/team-performance/${managerId}`, { 
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",     
    },
  });
    return response.data;
}

export const fetchManagerTeamMembers = async (managerId: number) => {
  const response = await  API.get(`/managers/members?managerId=${managerId}`, {
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
  });
    return response.data;
}