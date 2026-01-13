import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ApplyLeavePayload {
  fieldExecutiveId: number;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  reason?: string;
}

export const applyLeave = async (payload: ApplyLeavePayload) => {
  const { data } = await API.post("/leaves/apply", payload);
  return data;
};

export const fetchMonthlyConfirmedLeaves = async (
  feId: number
): Promise<number> => {
  const { data } = await API.get(
    `/leaves/${feId}/summary/current-month`
  );
  console.log(data);
  return data.data;
};

export const fetchLeavesByFE = async (feId: number) => {
  const res = await API.get(`/leaves/${feId}`);
  return res.data;
  console.log(res);
};

export type LeaveType =
  | "CASUAL_LEAVE"
  | "SICK_LEAVE"
  | "EARNED_LEAVE";