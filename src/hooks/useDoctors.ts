import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  hospital: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorFormData {
  name: string;
  specialization: string;
  hospital?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  notes?: string;
  isActive?: boolean;
}

export interface DoctorFilters {
  search?: string;
  specialization?: string;
  city?: string;
  isActive?: boolean;
}

export const useDoctors = (filters?: DoctorFilters) => {
  return useQuery({
    queryKey: ["doctors", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.search) {
        params.append("search", filters.search);
      }
      if (filters?.specialization) {
        params.append("specialization", filters.specialization);
      }
      if (filters?.city) {
        params.append("city", filters.city);
      }
      if (filters?.isActive !== undefined) {
        params.append("isActive", String(filters.isActive));
      }

      const queryString = params.toString();
      const endpoint = `/doctors${queryString ? `?${queryString}` : ""}`;

      return apiRequest<Doctor[]>(endpoint);
    },
  });
};

export const useDoctor = (id: string) => {
  return useQuery({
    queryKey: ["doctors", id],
    queryFn: async () => {
      return apiRequest<Doctor>(`/doctors/${id}`);
    },
    enabled: !!id,
  });
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: DoctorFormData) => {
      return apiRequest<Doctor>("/doctors", {
        method: "POST",
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast({
        title: "Success",
        description: "Doctor created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DoctorFormData> }) => {
      return apiRequest<Doctor>(`/doctors/${id}`, {
        method: "PUT",
        body: data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast({
        title: "Success",
        description: "Doctor updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      return apiRequest<void>(`/doctors/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      toast({
        title: "Success",
        description: "Doctor deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
