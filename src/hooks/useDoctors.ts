import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export type Category = "A_PLUS" | "A" | "B";
export type PracticeType = "RP" | "OP" | "NP";

export interface Doctor {
  id: number;
  name: string;
  category: Category;
  practiceType: PracticeType;
  designation: string | null;
  hospitalName: string;
  location: string | null;
  contactNumber: string | null;
  doctorCode: string | null;
  latitude: string | null;
  longitude: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface DoctorFormData {
  name: string;
  category: Category;
  practiceType: PracticeType;
  designation?: string;
  hospitalName: string;
  location?: string;
  contactNumber?: string;
  doctorCode?: string;
  latitude?: string;
  longitude?: string;
  active?: boolean;
}

export interface DoctorFilters {
  search?: string;
  category?: Category;
  practiceType?: PracticeType;
  active?: boolean;
}

export const useDoctors = (filters?: DoctorFilters) => {
  return useQuery({
    queryKey: ["doctors", filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters?.search) {
        params.append("search", filters.search);
      }
      if (filters?.category) {
        params.append("category", filters.category);
      }
      if (filters?.practiceType) {
        params.append("practiceType", filters.practiceType);
      }
      if (filters?.active !== undefined) {
        params.append("active", String(filters.active));
      }

      const queryString = params.toString();
      const endpoint = `/doctors${queryString ? `?${queryString}` : ""}`;

      return apiRequest<Doctor[]>(endpoint);
    },
  });
};

export const useDoctor = (id: number) => {
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
    mutationFn: async ({ id, data }: { id: number; data: Partial<DoctorFormData> }) => {
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
    mutationFn: async (id: number) => {
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
