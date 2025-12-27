import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
  is_active?: boolean;
}

export interface DoctorFilters {
  search?: string;
  specialization?: string;
  city?: string;
  is_active?: boolean;
}

export const useDoctors = (filters?: DoctorFilters) => {
  return useQuery({
    queryKey: ["doctors", filters],
    queryFn: async () => {
      let query = supabase
        .from("doctors")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,hospital.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`
        );
      }

      if (filters?.specialization) {
        query = query.eq("specialization", filters.specialization);
      }

      if (filters?.city) {
        query = query.eq("city", filters.city);
      }

      if (filters?.is_active !== undefined) {
        query = query.eq("is_active", filters.is_active);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Doctor[];
    },
  });
};

export const useDoctor = (id: string) => {
  return useQuery({
    queryKey: ["doctors", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Doctor | null;
    },
    enabled: !!id,
  });
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: DoctorFormData) => {
      const { data: doctor, error } = await supabase
        .from("doctors")
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return doctor;
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
      const { data: doctor, error } = await supabase
        .from("doctors")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return doctor;
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
      const { error } = await supabase.from("doctors").delete().eq("id", id);

      if (error) throw error;
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
