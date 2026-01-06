import axios from "axios";

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