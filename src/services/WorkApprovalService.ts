import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface CreateWorkApprovalRequest {
  workDate: string;
  fieldExecutiveId?: number | null;
  managerId?: number | null;
  description: string;
}

export const createWorkApproval = async (payload: CreateWorkApprovalRequest) => {
  console.log(payload);
  const res = await API.post(`/approval-requests/raise`, payload);
  return res.data;
};
export const fetchCurrentMonthWorkApprovals = async (
  fieldExecutiveId?: number | null,
  managerId?: number | null
) => {
  console.log(fieldExecutiveId,managerId);
  const params: any = {};

  if (fieldExecutiveId) {
    params.fieldExecutiveId = fieldExecutiveId;
  }

  if (managerId) {
    params.managerId = managerId;
  }

  const res = await API.get(`/approval-requests/current-month`, { params });
  return res.data;
};

export const approveWorkApproval = async (id: number, adminId: number) => {
  const res = await API.put(`/approval-requests/${id}/approve`, null, {
    params: { adminId },
  });
  return res.data;
};

export const rejectWorkApproval = async (id: number, adminId: number) => {
  const res = await API.put(`/approval-requests/${id}/reject`, null, {
    params: { adminId },
  });
  return res.data;
};

export const fetchCurrentMonthApprovals = async () => {
  const res = await API.get("/approval-requests/total/current-month");
  return res.data;
};
