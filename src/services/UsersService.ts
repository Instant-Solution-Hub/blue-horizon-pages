import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// fetch all doctors
export const fetchDoctors = async () => {
  const response = await API.get(`/doctors`, {
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
  });
  return response.data;
};

// fetch all pharmacists
export const fetchPharmacists = async () => {
  const response = await API.get(`/pharmacies`, {
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
  });
  return response.data;
};