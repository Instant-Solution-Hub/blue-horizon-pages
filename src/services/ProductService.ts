import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Product {
  id:number;
  name: string;
  description?: string;
  category:string;
  price:number;
  pts:number;
  ptr:number;
  
}

export interface ProductRequestDto {
  name: string;
  description?: string;
  category:string;
  price:number;
  pts:number;
  ptr:number;
}

export const getProducts = async ()  => {
  const res = await API.get(`/products`);

  console.log("Result");
  console.log(res);
  return res.data.data;
  
};

export const createProduct = async (payload:ProductRequestDto) : Promise<Product>=> {
  const res = await API.post(`/products`, payload);

  console.log("Result");
  console.log(res);
  return res.data.data;
  
};

export const updateProduct = async (id:number, payload:ProductRequestDto) : Promise<Product>=> {
  const res = await API.put(`/products/${id}`, payload);

  console.log("Result");
  console.log(res);
  return res.data.data;
  
};
