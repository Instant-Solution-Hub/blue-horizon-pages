import { JoiningFormData } from "@/components/manager-joining/RecordJoiningModal";
import axios from "axios";
import { ManagerJoiningRecord } from "@/components/manager-joining/ManagerJoiningView";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


 export const fetchManagerJoinings =  async (feId:number,month:number,year:number) => {
       
    const response = await API.get(`/manager-joinings/fe/monthly` ,  {
          params: { feId, month, year }
        })
        return response.data;
};


export const calculateStatus = (
  scheduledTime: string,
  joiningTime: string
): "ON_TIME" | "EARLY" | "LATE" => {
  const [sh, sm] = scheduledTime.split(":").map(Number);
  const [jh, jm] = joiningTime.split(":").map(Number);

  const scheduledMinutes = sh * 60 + sm;
  const joiningMinutes = jh * 60 + jm;

  const diff = joiningMinutes - scheduledMinutes;

  if (diff < -5) return "EARLY";
  if (diff > 5) return "LATE";
  return "ON_TIME";
};
function combineDateTime(date: Date, time: string) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

export const addNewRecord = async (
  data: JoiningFormData,
  feId: number
) => {
  const status = calculateStatus(data.scheduledTime, data.joiningTime);

  const payload = {
    fieldExecutiveId: feId,
    doctorId: Number(data.doctorId),
    scheduledTime: combineDateTime(data.date, data.scheduledTime),
    actualJoiningTime: combineDateTime(data.date, data.joiningTime),
    status,
    notes: data.notes,
  };

  const response = await API.post("/manager-joinings", payload);
  return response.data;
};


export const fetchCurrentMonthManagerJoinings = async (
  managerId: number
): Promise<ManagerJoiningRecord[]> => {
  const res = await API.get(
    `/manager-joinings/manager/${managerId}/current-month`
  );

  return res.data;
};

export const fetchAllCurrentMonthManagerJoinings = async (): Promise<ManagerJoiningRecord[]> => {
  const res = await API.get(
    `/manager-joinings/current-month`
  );
 console.log(res);
  return res.data;
};
