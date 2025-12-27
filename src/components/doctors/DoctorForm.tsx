import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doctor, DoctorFormData, Category, PracticeType } from "@/hooks/useDoctors";

const categories: { value: Category; label: string }[] = [
  { value: "A_PLUS", label: "A+" },
  { value: "A", label: "A" },
  { value: "B", label: "B" },
];

const practiceTypes: { value: PracticeType; label: string }[] = [
  { value: "RP", label: "RP (Regular Practice)" },
  { value: "OP", label: "OP (Outpatient)" },
  { value: "NP", label: "NP (New Practice)" },
];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  category: z.enum(["A_PLUS", "A", "B"], { required_error: "Category is required" }),
  practiceType: z.enum(["RP", "OP", "NP"], { required_error: "Practice type is required" }),
  designation: z.string().max(100).optional(),
  hospitalName: z.string().min(1, "Hospital name is required").max(200),
  location: z.string().max(200).optional(),
  contactNumber: z.string().max(20).optional(),
  doctorCode: z.string().max(50).optional(),
  latitude: z.string().max(50).optional(),
  longitude: z.string().max(50).optional(),
  active: z.boolean().default(true),
});

interface DoctorFormProps {
  doctor?: Doctor | null;
  onSubmit: (data: DoctorFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DoctorForm = ({ doctor, onSubmit, onCancel, isLoading }: DoctorFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: doctor?.name || "",
      category: doctor?.category || undefined,
      practiceType: doctor?.practiceType || undefined,
      designation: doctor?.designation || "",
      hospitalName: doctor?.hospitalName || "",
      location: doctor?.location || "",
      contactNumber: doctor?.contactNumber || "",
      doctorCode: doctor?.doctorCode || "",
      latitude: doctor?.latitude || "",
      longitude: doctor?.longitude || "",
      active: doctor?.active ?? true,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      name: values.name,
      category: values.category,
      practiceType: values.practiceType,
      designation: values.designation || undefined,
      hospitalName: values.hospitalName,
      location: values.location || undefined,
      contactNumber: values.contactNumber || undefined,
      doctorCode: values.doctorCode || undefined,
      latitude: values.latitude || undefined,
      longitude: values.longitude || undefined,
      active: values.active,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Dr. John Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input placeholder="MBBS, MD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="practiceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Practice Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select practice type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {practiceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hospitalName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hospital Name *</FormLabel>
                <FormControl>
                  <Input placeholder="City Hospital" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Mumbai, Maharashtra" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input placeholder="+91 9876543210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctorCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor Code</FormLabel>
                <FormControl>
                  <Input placeholder="DOC001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input placeholder="19.0760" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input placeholder="72.8777" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 md:col-span-2">
                <div className="space-y-0.5">
                  <FormLabel>Active Status</FormLabel>
                  <FormDescription>
                    Mark if this doctor is currently active
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : doctor ? "Update Doctor" : "Create Doctor"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DoctorForm;
