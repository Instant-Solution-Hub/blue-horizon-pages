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


export const fetchFEs = async (): Promise<FieldExecutive[]> => {
  const res = await API.get(
    `/field-executives`
  );
  console.log(res);

  return res.data; // ApiResponseDto → data
};
