import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export const slotChangeRequest = async (obj) : Promise<any[]> => {
  const res = await API.post(`/slot-change-requests`, obj);
  console.log(res);
  return res.data.data; // ApiResponseDto → data
}

export const getAllPendingRequests = async () : Promise<any[]> => {
  const res = await API.get(`/slot-change-requests/pending`);
  console.log(res);
  return res.data; // ApiResponseDto → data
}

export const reviewSlotChangeRequest = async (requestId: number, adminId: number, obj) : Promise<any[]> => {
  const res = await API.post(`/slot-change-requests/${requestId}/${adminId}/review`, obj);
  console.log(res);
  return res.data; // ApiResponseDto → data
}


export const slotPlanDayRequestFieldExecutive = async (obj, feId) : Promise<any[]> => {
  const res = await API.post(`/slot-planning-requests/field-executive/${feId}`, obj);
  console.log(res);
  return res.data.data; // ApiResponseDto → data
}

export const slotPlanDayRequestManager = async (obj, managerId) : Promise<any[]> => {
  const res = await API.post(`/slot-planning-requests/manager/${managerId}`, obj);
  console.log(res);
  return res.data.data; // ApiResponseDto → data
}

export const checkIfSlotPlanDayEnabled = async (userType, userId) : Promise<any> => {
  const res = await API.get(`/slot-planning-requests/can-plan-slot-today?requesterType=${userType}&requesterId=${userId}`);
  console.log(res);
  return res.data; // ApiResponseDto → data
}