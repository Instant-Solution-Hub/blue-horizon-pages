import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Loader, CalendarIcon} from "lucide-react";
import AddDoctorConversionModal from "@/components/admin-doctor-conversions/AddDoctorConversionModal";
import DoctorConversionList from "@/components/admin-doctor-conversions/DoctorConversionList";
import { FieldExecutive, fetchFEs } from "@/services/FEService";
import { Doctor } from "@/components/manager-joining/RecordJoiningModal";
import { DoctorConversion, fetchDoctorConversions ,addDoctorConversion, fetchDoctorConversionsForTheMonth, deleteDoctorConversion, DoctorConversionReqDto } from "@/services/DoctorConversion";
import { fetchDoctorsByFE } from "@/services/DoctorService";
import { getProducts, Product as ProductType } from "@/services/ProductService";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const AdminDoctorConversions = () => {
  const { toast } = useToast();
  const [conversions, setConversions] = useState<DoctorConversion[]>([]);
  const [fieldExecutives, setFieldExecutives] = useState<FieldExecutive[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
   const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

  const feId = parseInt(sessionStorage.getItem("feID") || "0");

  const loadConversions = async (fDate?: Date, tDate?: Date) => {
  try {
    setLoading(true);

    let conversionsData;

    if (fDate && tDate) {
      conversionsData = await fetchDoctorConversions(
        format(fDate, "yyyy-MM-dd"),
        format(tDate, "yyyy-MM-dd")
      );
    } else {
      conversionsData = await fetchDoctorConversionsForTheMonth();
    }

    const sortedData = Array.isArray(conversionsData)
      ? [...conversionsData].sort((a, b) =>
          (a.fieldExecutiveName || "").localeCompare(
            b.fieldExecutiveName || "",
            undefined,
            { sensitivity: "base" }
          )
        )
      : [];

    setConversions(sortedData);
  } catch (err) {
    console.error("Failed to load conversions", err);
    toast({
      title: "Error",
      description: "Failed to load doctor conversions data.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (fromDate && toDate) {
    loadConversions(fromDate, toDate);
  }
}, [fromDate, toDate]);

  // Fetch all required data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch Field Executives
        const fesData = await fetchFEs();
        setFieldExecutives(Array.isArray(fesData) ? fesData : []);
      

        // Fetch Products
        const productsData = await getProducts();
        setProducts(Array.isArray(productsData) ? productsData : []);

        // Fetch Conversions for current month
       await loadConversions();
      
      } catch (err) {
        console.error("Failed to load data", err);
        toast({
          title: "Error",
          description: "Failed to load doctor conversions data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [feId]);

  const loadDoctorsByFE = async (feId: number) => {
  try {
    const doctorsData = await fetchDoctorsByFE(feId);
    setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
  } catch (err) {
    console.error("Failed to load doctors", err);
    toast({
      title: "Error",
      description: "Failed to load doctors.",
      variant: "destructive",
    });
  }
};

  const handleAddConversion = async (data: {
    fieldExecutiveId: number;
    doctorId: string;
    productId: number;
  }) => {
    try {
      setLoading(true);
      const payload: DoctorConversionReqDto = {
        fieldExecutiveId: data.fieldExecutiveId,
        doctorId: data.doctorId,
        productId: data.productId,
      };

      const result = await addDoctorConversion(payload);

      // API returns the single newly created conversion — prepend to existing list
      if (result) {
        await loadConversions(); 
         setFromDate(undefined);
  setToDate(undefined);
      }
      toast({
        title: "Success",
        description: "Doctor conversion added successfully.",
      });

      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Failed to add conversion", err);
      toast({
        title: "Error",
        description: "Failed to add doctor conversion.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversion = async (feIdParam: number, id: number) => {
    try {
      setLoading(true);
      await deleteDoctorConversion(feIdParam, id);

      // Remove from local state on successful deletion
      setConversions((prev) => prev.filter((c) => c.id !== id));

      toast({
        title: "Success",
        description: "Doctor conversion deleted successfully.",
      });
    } catch (err) {
      console.error("Failed to delete conversion", err);
      toast({
        title: "Error",
        description: "Failed to delete doctor conversion.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && conversions.length === 0) {
    return (
      <div className="h-screen bg-background flex overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <Loader className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading conversions...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Doctor Conversions</h1>
            <p className="text-muted-foreground">
              Manage doctor conversions by Field Executives
            </p>
          </div>

          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsAddModalOpen(true)} disabled={loading}>
              <Plus className="w-4 h-4 mr-2" />
              Add Conversion
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="space-y-1">
              <Label className="text-sm">From Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[180px] justify-start text-left font-normal",
                      !fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Label className="text-sm">To Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[180px] justify-start text-left font-normal",
                      !toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {(fromDate || toDate) && (
              <Button
                variant="ghost"
                className="self-end"
              onClick={() => {
  setFromDate(undefined);
  setToDate(undefined);
  loadConversions(); // 🔥 back to current month
}}
              >
                Clear
              </Button>
            )}
          </div>

          {conversions.length === 0 && !loading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground text-center">
                  No doctor conversions added yet.
                  <br />
                  Click "Add Conversion" to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <DoctorConversionList
              conversions={conversions}
              onDelete={handleDeleteConversion}
            />
          )}

          <AddDoctorConversionModal
            open={isAddModalOpen}
            onOpenChange={setIsAddModalOpen}
            onAdd={handleAddConversion}
            fieldExecutives={fieldExecutives}
            doctors={doctors}
            products={products}
            onFEChange={loadDoctorsByFE}
          />
        </main>
      </div>
    </div>
  );
};

export default AdminDoctorConversions;
