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

export interface ManagerContactUpdateRequest {
  phone: string;
  email: string;
  emergencyContact: string;
}

export interface AdminContactUpdateRequest {
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

export interface ManagerContactResponse {
  managerId: number;
  phone: string;
  email: string;
  emergencyContact: string;
  name:string;
}

export interface AdminContactResponse {
  adminId: number;
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

export const fetchManagerContactDetails = async (
  managerId: number,
): Promise<ManagerContactResponse> => {
  const res = await API.get(
    `/managers/${managerId}/contact`,
   
  );
  console.log("result: ");
  console.log(res);

  return res.data.data;
};

export const updateManagerContactDetails = async (
  managerId: number,
  payload: ManagerContactUpdateRequest
): Promise<ManagerContactResponse> => {
  const res = await API.put(
    `/managers/${managerId}/contact/basic`,
    payload
  );

  return res.data.data;
};

export const updateAdminContactDetails = async (
  adminId: number,
  payload: AdminContactUpdateRequest
): Promise<AdminContactResponse> => {
  const res = await API.put(
    `/admin/${adminId}/contact/basic`,
    payload
  );

  return res.data.data;
};




export const fetchAdminContact = async () => {
  const { data } = await API.get("/admin/contact");
  console.log(data);
  return data.data;
};


export const fetchSuperAdminContact = async () => {
  const { data } = await API.get("/super-admin/contact");
  console.log(data);
  return data.data;
};

/* ================= TEAM (FEs under manager) ================= */
export const fetchFEContactsUnderManager = async (managerId: number) => {
  const res = await API.get(
    `/managers/${managerId}/field-executives/contacts`
  );
  console.log(res);
  return res.data.data;
};

export const fetchFEContacts = async () => {
  const res = await API.get(
    `/field-executives/contact`
  );
  console.log(res);
  return res.data.data;
};

export const fetchManagerContacts = async () => {
  const res = await API.get(
    `/managers/contact`
  );
  console.log(res);
  return res.data.data;
};




