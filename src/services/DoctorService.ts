import axios from "axios";
import type { Doctor, PracticeType } from "@/hooks/useDoctors";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchDoctorsByFE = async (feId: number): Promise<Doctor[]> => {
  const res = await API.get(`/field-executives/${feId}/doctors`);
  return res.data.data; // ApiResponseDto → data
};


export const fetchAllDoctors = async (): Promise<Doctor[]> => {
  const res = await API.get(
    `/doctors/all`
  );  
  return res.data.data; // ApiResponseDto → data
}

export interface DoctorChangeRequest {
  id: string;
  doctorId: string;
  doctorName: string;
  fieldExecutiveId: string;
  fieldExecutiveName: string;
  currentPracticeType: PracticeType;
  requestedPracticeType: PracticeType;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requestedAt: string;
  reviewedAt?: string;
}

export interface DoctorChangeStats {
  feId: string;
  feName: string;
  upgraded: number;
  downgraded: number;
}

export const fetchDoctorChangeStats = async (
  feId: number
): Promise<DoctorChangeStats> => {
  const res = await API.get(
    `/field-executives/${feId}/doctor-change-stats`
  );
  return res.data.data;
};

export const fetchDoctorChangeRequests = async (
  feId: number
): Promise<DoctorChangeRequest[]> => {
  const res = await API.get(
    `/field-executives/${feId}/doctor-change-requests`
  );
  return res.data.data;
};

export const fetchAllDoctorChangeStats = async (): Promise<DoctorChangeStats[]> => {
  const res = await API.get(`/field-executives/doctor-change-stats`);
  return res.data.data;
};

export const fetchPendingDoctorChangeRequests = async (): Promise<DoctorChangeRequest[]> => {
  const res = await API.get(`/doctor-change-requests/pending`);
  return res.data.data;
};

export const processDoctorChangeRequest = async (
  requestId: number,
  status: "PENDING" | "APPROVED" | "REJECTED"
): Promise<DoctorChangeRequest> => {
  const res = await API.put(
    `/doctor-change-requests/${requestId}`,
    {
      status,
    }
  );
  return res.data.data;
};

export const createDoctorChangeRequest = async (
  feId: number,
  doctorId: number,
  requestedPracticeType: PracticeType
): Promise<DoctorChangeRequest> => {
  const res = await API.post(
    `/field-executives/${feId}/doctor-change-requests`,
    {
      doctorId,
      requestedPracticeType,
    }
  );
  return res.data.data;
};

export const fetchDoctorVisualAidByCategory= async (category): Promise<any[]> => {
  const res = await API.get(
    `/visual-aids/category/${category}`
  );  
  return res.data; // ApiResponseDto → data
}

