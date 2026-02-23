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

  export interface ManagerLeaveRequest {
  id: number;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  appliedDate:string;
    managerCode: string;
    managerName: string;

  };


export interface ManagerLeave {
  id: string;
  leaveType: LeaveType;
  status: LeaveStatus;
  fromDate: string;
  toDate: string;
  reason?: string;
}

export interface ApplyManagerLeavePayload {
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  reason?: string;
  managerId: number;
}

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const applyManagerLeave = async (
  payload: ApplyManagerLeavePayload
): Promise<ManagerLeave> => {
  const res = await API.post("/managers/leaves/apply", payload);
  return res.data;
};

export const getManagerLeaves = async (
  managerId: number
): Promise<ManagerLeave[]> => {
  const res = await API.get(`/managers/leaves/${managerId}`);
  console.log(res);
  return res.data;
};

export const fetchMonthlyConfirmedLeaves = async (
  managerId: number
): Promise<number> => {
  const { data } = await API.get(
    `/managers/leaves/${managerId}/confirmed-leaves/current-month`
  );
  console.log(data);
  return data;
};


export const fetchTeamLeaveRequests = async (managerId: number) => {
  const res = await API.get(
    `/managers/${managerId}/fe-leaves`
  );
  console.log(res);
  return res.data.data as LeaveRequest[];
};


export const fetchLeaveRequests = async () => {
  const res = await API.get(
    `/leaves/fe-leaves`
  );
  console.log(res);
  return res.data.data as LeaveRequest[];
};


export const fetchManagerLeaveRequests = async () => {
  const res = await API.get(
    `/managers/manager-leaves`
  );
  console.log(res);
  return res.data.data as ManagerLeaveRequest[];
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

export const approveManagerLeaveRequest = async (
  leaveId: number
): Promise<ManagerLeaveRequest> => {
  const res = await API.put(
    `/leaves/${leaveId}/manager/approve-leave`
  );
  console.log(res);
  return res.data.data;
};

export const rejectManagerLeaveRequest = async (
  leaveId: number
): Promise<ManagerLeaveRequest> => {
  const res = await API.put(
    `/leaves/${leaveId}/manager/reject-leave`
  );
  return res.data.data;
};


