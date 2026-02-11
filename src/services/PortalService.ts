// src/api/portal.ts
import {apiClient} from "@/lib/api";
import { getUserType } from "@/lib/userRoleUtils";
import { useNavigate } from "react-router-dom";

export interface PortalStatusResponse {
  isLocked: boolean;
  userType: string;
  userId: number;
}

export const checkPortalStatus = async () => {
    let obj = {
    "userId": sessionStorage.getItem("userID"),
    "userType": getUserType()
    }
  const res = await apiClient.post<PortalStatusResponse>("/portal/status", obj);
  return res.data;
};


export const requestPortalUnlock = async (reason: string) => {
    let obj = {
    "userId": sessionStorage.getItem("userID"),    
    "userType": getUserType(),
    "reason": reason
    }
  const res = await apiClient.post("/portal/request-unlock", obj);
  return res.data;
}

export const fetchAllPortalUnlockRequests = async () => {
  const response = await apiClient.get("/portal/admin/all-requests", { 
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
  });
    return response.data;
}

export const processPortalUnlockRequest = async (requestId: number, obj) => {
  const response = await apiClient.post(`/portal/admin/unlock-requests/${requestId}/process`, obj, { 
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
  });
    return response.data;
}