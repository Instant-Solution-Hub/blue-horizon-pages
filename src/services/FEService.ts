import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface FieldExecutive {
  id: number;
  name: string;
  managerId:number;
  managerName:string;
}

export interface FEInfo{
   id: number;
    name: string;
    email: string;
    phone: string;
    employeeCode: string;
    territory: string;
    region: string;
    managerName: string;
    managerId: number;
    markets: string[];
}

export interface UpdateFEReq {
   
    name:string;
    phone:string;
    region:string;
    markets:string[];
    managerId:number;
    territory:string;
}


export const fetchFEs = async (): Promise<FieldExecutive[]> => {
  const res = await API.get(
    `/field-executives`
  );
  console.log(res);

  return res.data; // ApiResponseDto → data
};
export const fetchFieldExecutiveInfos = async () : Promise<FEInfo[]> => {
  const res = await API.get(`/field-executives`);
  console.log(res);
  return res.data; // ApiResponseDto → data
}

export const updateFieldExecutive = async (id:number,feData: UpdateFEReq) : Promise<FEInfo> => {
  console.log(feData);
  const res = await API.put(`/field-executives/${id}`, feData);
  console.log(res);
  return res.data; // ApiResponseDto → data
}

export const addFieldExecutive = async (feData: any) : Promise<FEInfo[]> => {
  console.log(feData);
  const res = await API.post(`/field-executives`, feData);
  console.log(res);
  return res.data; // ApiResponseDto → data
}
