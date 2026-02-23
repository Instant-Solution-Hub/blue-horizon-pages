import axios from "axios";

export interface CompanyTarget {
  targetAmount: number;
  currentProgress: number;
  year:number;
  month:number;
}

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

export const fetchMonthlyProductSales = async (feId: number) => {
  const res = await API.get("/fe/monthly-sales", {
    params: { feId },
  });
  return res.data;
};

export const updateMonthlyProductSales = async (
  feId: number,
  productId: number,
  quantity: number
) => {
    console.log(feId + " "+ productId + " " + quantity);
  const res = await API.put(
    "/fe/monthly-sales",
    { productId, quantity, feId }
  );
  return res.data;
};

export const fetchMonthlyStockistSales = async (feId: number) => {
  const res = await API.get("/fe/monthly-stockist-sales", {
    params: { feId },
  });
  return res.data;
};

export const updateMonthlyStockistSales = async (
  feId: number,
  stockistId: number,
  price: number
) => {
    console.log(feId + " "+ stockistId + " " + price);
  const res = await API.put(
    "/fe/monthly-stockist-sales",
    { stockistId, price, feId }
  );
  return res.data;
};


export const getMonthlyMarketSales = async (
  feId: number
) => {

  const res = await API.get(`/fe/market-sales/${feId}/current-month`);
  console.log(res);
  return res.data;
};

export const updateMarketSales = async (
  feId: number,
  payload: {
    market: string;
    salesAmount: number;
  }
) => {
  const res = await API.put(`/fe/market-sales/${feId}`, payload);
  console.log(res);
  return res.data;
};

export const fetchMonthlyMarketSales = async () => {
  const res = await API.get(`/fe/market-sales/current-month/all`);
  console.log(res);
  return res.data;
}

export const fetchCompanyTarget=  async () => { 

  const res = await API.get(`/super-admin/company-target/current-month`);
  console.log(res); 
  return res.data;
}

export const updateCompanyTarget=  async (payload:CompanyTarget) => { 

  const res = await API.post(`/super-admin/company-target`, payload);
  console.log(res); 
  return res.data;
}

export const getAllMonthlyMarketSales = async (year:number, month:number) => {
  console.log("Fetching market sales for", year, month);
  const res = await API.get(`/fe/market-sales/all-details`, {
    params: {
      year,
      month,
    },
  });

  console.log(res);
  return res.data;
};


export const getAllMonthlyProductSales = async (year:number, month:number) => {
  const res = await API.get(`/fe/monthly-sales/all/summary`, {
    params: {
      year,
      month,
    },
  });

  console.log(res);
  return res.data;
};

export const getAllMonthlyStockistSales = async (year:number, month:number) => {
  console.log("Fetching stockist sales for", year, month);
  const res = await API.get(`/fe/monthly-stockist-sales/all/summary`, {
    params: {
      year,
      month,
    },
  });

  console.log(res);
  return res.data;
};