import { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Plus, Loader } from "lucide-react";
import AddDoctorConversionModal from "@/components/admin-doctor-conversions/AddDoctorConversionModal";
import DoctorConversionList from "@/components/admin-doctor-conversions/DoctorConversionList";
import { FieldExecutive, fetchFEs } from "@/services/FEService";
import { Doctor } from "@/components/manager-joining/RecordJoiningModal";
import { DoctorConversion, addDoctorConversion, fetchDoctorConversionsForTheMonth, deleteDoctorConversion, DoctorConversionReqDto } from "@/services/DoctorConversion";
import { fetchDoctorsByFE } from "@/services/DoctorService";
import { getProducts, Product as ProductType } from "@/services/ProductService";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const AdminDoctorConversions = () => {
  const { toast } = useToast();
  const [conversions, setConversions] = useState<DoctorConversion[]>([]);
  const [fieldExecutives, setFieldExecutives] = useState<FieldExecutive[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const feId = parseInt(sessionStorage.getItem("feID") || "0");

  // Fetch all required data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch Field Executives
        const fesData = await fetchFEs();
        setFieldExecutives(Array.isArray(fesData) ? fesData : []);

        // Fetch Doctors for current FE
      

        // Fetch Products
        const productsData = await getProducts();
        setProducts(Array.isArray(productsData) ? productsData : []);

        // Fetch Conversions for current month
        const conversionsData = await fetchDoctorConversionsForTheMonth();
        setConversions(Array.isArray(conversionsData) ? conversionsData : []);
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
        setConversions((prev) => [result, ...prev]);
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
