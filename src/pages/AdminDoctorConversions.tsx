import { useState } from "react";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddDoctorConversionModal from "@/components/admin-doctor-conversions/AddDoctorConversionModal";
import DoctorConversionList from "@/components/admin-doctor-conversions/DoctorConversionList";

export interface DoctorConversion {
  id: string;
  fieldExecutiveId: string;
  fieldExecutiveName: string;
  managerId: string;
  managerName: string;
  doctorId: string;
  doctorName: string;
  productId: string;
  productName: string;
  createdAt: string;
}

export interface FieldExecutive {
  id: string;
  name: string;
  managerId: string;
  managerName: string;
}

export interface Doctor {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
}

// Mock data for Field Executives with their managers
const mockFieldExecutives: FieldExecutive[] = [
  { id: "fe1", name: "Rahul Kumar", managerId: "m1", managerName: "Amit Sharma" },
  { id: "fe2", name: "Priya Singh", managerId: "m1", managerName: "Amit Sharma" },
  { id: "fe3", name: "Vikram Patel", managerId: "m2", managerName: "Neha Gupta" },
  { id: "fe4", name: "Anjali Verma", managerId: "m2", managerName: "Neha Gupta" },
  { id: "fe5", name: "Suresh Reddy", managerId: "m3", managerName: "Rajesh Kumar" },
];

// Mock data for Doctors
const mockDoctors: Doctor[] = [
  { id: "d1", name: "Dr. Arun Mehta" },
  { id: "d2", name: "Dr. Sunita Rao" },
  { id: "d3", name: "Dr. Kiran Shah" },
  { id: "d4", name: "Dr. Manish Joshi" },
  { id: "d5", name: "Dr. Pooja Nair" },
];

// Mock data for Products
const mockProducts: Product[] = [
  { id: "p1", name: "Larimar-500" },
  { id: "p2", name: "Cardio-Plus" },
  { id: "p3", name: "NeuroCalm" },
  { id: "p4", name: "DiabeCare" },
  { id: "p5", name: "ImmunBoost" },
];

// Mock initial conversions
const initialConversions: DoctorConversion[] = [
  {
    id: "1",
    fieldExecutiveId: "fe1",
    fieldExecutiveName: "Rahul Kumar",
    managerId: "m1",
    managerName: "Amit Sharma",
    doctorId: "d1",
    doctorName: "Dr. Arun Mehta",
    productId: "p1",
    productName: "Larimar-500",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    fieldExecutiveId: "fe2",
    fieldExecutiveName: "Priya Singh",
    managerId: "m1",
    managerName: "Amit Sharma",
    doctorId: "d2",
    doctorName: "Dr. Sunita Rao",
    productId: "p2",
    productName: "Cardio-Plus",
    createdAt: "2024-01-16",
  },
  {
    id: "3",
    fieldExecutiveId: "fe3",
    fieldExecutiveName: "Vikram Patel",
    managerId: "m2",
    managerName: "Neha Gupta",
    doctorId: "d3",
    doctorName: "Dr. Kiran Shah",
    productId: "p3",
    productName: "NeuroCalm",
    createdAt: "2024-01-17",
  },
];

const AdminDoctorConversions = () => {
  const [conversions, setConversions] = useState<DoctorConversion[]>(initialConversions);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddConversion = (data: {
    fieldExecutiveId: string;
    doctorId: string;
    productId: string;
  }) => {
    const fieldExecutive = mockFieldExecutives.find((fe) => fe.id === data.fieldExecutiveId);
    const doctor = mockDoctors.find((d) => d.id === data.doctorId);
    const product = mockProducts.find((p) => p.id === data.productId);

    if (!fieldExecutive || !doctor || !product) return;

    const newConversion: DoctorConversion = {
      id: Date.now().toString(),
      fieldExecutiveId: fieldExecutive.id,
      fieldExecutiveName: fieldExecutive.name,
      managerId: fieldExecutive.managerId,
      managerName: fieldExecutive.managerName,
      doctorId: doctor.id,
      doctorName: doctor.name,
      productId: product.id,
      productName: product.name,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setConversions([...conversions, newConversion]);
  };

  const handleDeleteConversion = (id: string) => {
    setConversions(conversions.filter((c) => c.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Doctor Conversions</h1>
          <p className="text-muted-foreground">
            Manage doctor conversions by Field Executives
          </p>
        </div>

        <div className="flex justify-end mb-4">
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Conversion
          </Button>
        </div>

        <DoctorConversionList
          conversions={conversions}
          onDelete={handleDeleteConversion}
        />

        <AddDoctorConversionModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onAdd={handleAddConversion}
          fieldExecutives={mockFieldExecutives}
          doctors={mockDoctors}
          products={mockProducts}
        />
      </main>
    </div>
  );
};

export default AdminDoctorConversions;
