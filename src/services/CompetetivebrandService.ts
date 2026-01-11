import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const createCompetitiveReport = async (
  data: any,
  image?: File | null
) => {
  const formData = new FormData();

  // backend expects this key to be "data"
  formData.append("data", JSON.stringify(data));

  if (image) {
    formData.append("image", image);
  }

  const res = await API.post("/competitive-reports", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  console.log(res);

  return res.data.data; // ApiResponseDto wrapper
};

export const updateCompetitiveReport = async (
  id: number,
  data: any,
  image?: File | null
) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));

  if (image) {
    formData.append("image", image);
  }

  const res = await API.put(`/competitive-reports/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data.data;
};

export const fetchCompetitiveReportsByFE = async (feId: number) => {
  const res = await API.get(
    `/competitive-reports/field-executive/${feId}`
  );

  // assuming ApiResponseDto structure
  return res.data.data;
};
