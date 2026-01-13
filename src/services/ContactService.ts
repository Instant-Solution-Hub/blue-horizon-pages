import axios from "axios"; 

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface FEContactUpdateRequest {
  phone: string;
  email: string;
  emergencyContact: string;
}

export interface FEContactResponse {
  feId: number;
  phone: string;
  email: string;
  emergencyContact: string;
  name:string;
}

export const updateFEContactDetails = async (
  feId: number,
  payload: FEContactUpdateRequest
): Promise<FEContactResponse> => {
  const res = await API.put(
    `/field-executives/${feId}/contact/basic`,
    payload
  );

  return res.data.data;
};

export const fetchFEContactDetails = async (
  feId: number,
): Promise<FEContactResponse> => {
  const res = await API.get(
    `/field-executives/${feId}/contact`,
   
  );
  console.log("result: ");
  console.log(res);

  return res.data.data;
};
