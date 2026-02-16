import axios from "axios";
import { Doctor } from "../components/manager-joining/RecordJoiningModal";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});




export const fetchDoctorsByFE = async (feId: number): Promise<Doctor[]> => {
  const res = await API.get(
    `/field-executives/${feId}/doctors`
  );
  console.log(res);

  return res.data.data; // ApiResponseDto → data
};


export const fetchAllDoctors = async (): Promise<Doctor[]> => {
  const res = await API.get(
    `/doctors/all`
  );  
  return res.data.data; // ApiResponseDto → data
}

export const fetchDoctorVisualAidByCategory= async (category): Promise<any[]> => {
  const res = await API.get(
    `/visual-aids/category/${category}`
  );  
  return res.data; // ApiResponseDto → data
}

