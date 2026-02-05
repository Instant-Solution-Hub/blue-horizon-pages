import axios from "axios";

export type LeaveType = "CASUAL_LEAVE" | "SICK_LEAVE" | "EARNED_LEAVE";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface LeaveRequest {
  id: number;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  appliedDate:string;
    feCode: string;
    feName: string;
  };


export interface AdminLeave {
  data: AdminLeave;
  id: string;
  leaveType: LeaveType;
  status: LeaveStatus;
  fromDate: string;
  toDate: string;
  reason?: string;
}

export interface ApplyAdminLeavePayload {
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  reason?: string;
  adminId: number;
}

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const applyAdminLeave = async (
  payload: ApplyAdminLeavePayload
): Promise<AdminLeave> => {
  const res = await API.post("/admin/leaves/apply", payload);
  console.log("API Response:", res);
  // Handle nested response structure
  const data = res.data.data || res.data;
  return data;
};

export const getAdminLeaves = async (
  adminId: number
): Promise<AdminLeave[]> => {
  const res = await API.get(`/admin/leaves/${adminId}`);
  console.log(res);
  return res.data;
};

export const fetchMonthlyConfirmedLeaves = async (
  adminId: number
): Promise<number> => {
  const { data } = await API.get(
    `/admin/leaves/${adminId}/current-month/count`
  );
  console.log(data);
  return data;
};


export const fetchManagersLeaveRequests = async (adminId: number) => {
  const res = await API.get(
    `/admin/${adminId}/manager-leaves`
  );
  console.log(res);
  return res.data.data as LeaveRequest[];
};

export const approveLeaveRequest = async (
  leaveId: number
): Promise<LeaveRequest> => {
  const res = await API.put(
    `/leaves/${leaveId}/approve-leave`
  );
  console.log(res);
  return res.data.data;
};

export const rejectLeaveRequest = async (
  leaveId: number
): Promise<LeaveRequest> => {
  const res = await API.put(
    `/leaves/${leaveId}/reject-leave`
  );
  return res.data.data;
};


