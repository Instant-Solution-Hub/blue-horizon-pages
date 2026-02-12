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

// apiClient.interceptors.response.use(
//   (response) => {
//     // Check if this response is portal status
//     if (
//       response.config.url?.includes("/portal/status") &&
//       response.data?.isLocked === true
//     ) {
//       window.location.href = "/portal-locked";
//     }

//     return response;
//   },
//   // (error) => {
//   //   return Promise.reject(error);
//   // }
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
