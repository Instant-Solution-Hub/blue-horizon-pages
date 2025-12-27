const API_BASE_URL = "http://localhost:8080/api";

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `API error: ${response.status}`);
  }

  // Handle empty responses (e.g., DELETE)
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export { API_BASE_URL };
