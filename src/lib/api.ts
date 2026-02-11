import axios from "axios";
import { getUserType } from "./userRoleUtils";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token if needed
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const userId = sessionStorage.getItem("userID");
    const userType = getUserType();

    if (userId) config.headers["X-User-Id"] = userId;
    if (userType) config.headers["X-User-Type"] = userType;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const message = error.response?.data?.message || error.message || "An error occurred";
//     return Promise.reject(new Error(message));
//   }
// );

export async function apiRequest<T>(
  endpoint: string,
  options: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const response = await apiClient.request<T>({
    url: endpoint,
    method,
    data: body,
    headers,
  });

  return response.data;
}

export { apiClient, API_BASE_URL };
