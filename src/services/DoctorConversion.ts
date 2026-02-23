import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface DoctorConversion {
  id: number;
  fieldExecutiveId: number;
  fieldExecutiveName: string;
  managerId: number;
  managerName: string;
  doctorId: number;
  doctorName: string;
  hospitalName:string;
  productId: number;
  productName: string;
  createdAt: string;
}

export interface DoctorConversionReqDto{
  fieldExecutiveId: number;
  doctorId: string;
  productId: number;
}



export const fetchDoctorConversionsForTheMonth = async (): Promise<DoctorConversion[]> => {
  const res = await API.get(
    `/doctor-conversions/current-month`
  );
  console.log(res);

  return res.data.data; // ApiResponseDto → data
};

export const addDoctorConversion = async (payload:DoctorConversionReqDto): Promise<DoctorConversion> => {
  const res = await API.post(
    `/doctor-conversions`,
    payload
  );
  console.log(res);

  return res.data; // ApiResponseDto → data
};

export const deleteDoctorConversion = async (feId:number,conversionId:number): Promise<void> => {
  console.log("Deleting conversion with ID:", conversionId, "for FE ID:", feId);
  const res = await API.delete(
    `/doctor-conversions/${feId}/${conversionId}`,
    
  );

  return res.data.data; // ApiResponseDto → data
};

export const fetchDoctorConversions = async (
  fromDate: string,
  toDate: string
): Promise<DoctorConversion[]> => {
  const res = await API.get(`/doctor-conversions`, {
    params: {
      fromDate,
      toDate,
    },
  });

  console.log(res);

  return res.data.data; // ApiResponseDto → data
};