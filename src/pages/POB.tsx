import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StatsCards from "@/components/pob/StatsCards";
import AddPOBModal from "@/components/pob/AddPOBModal";
import POBList, { POBOrder } from "@/components/pob/POBList";

const POB = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<POBOrder[]>([
    {
      id: "ord-001",
      doctorName: "Dr. Rajesh Kumar",
      hospitalName: "City Hospital",
      orderDate: new Date(2024, 0, 15),
      products: [
        { productName: "Paracetamol 500mg", qty: 100, price: 25, total: 2500 },
        { productName: "Amoxicillin 250mg", qty: 50, price: 45, total: 2250 },
      ],
      totalValue: 4750,
      notes: "Urgent delivery required",
      status: "confirmed",
      createdAt: new Date(2024, 0, 15, 10, 30),
    },
    {
      id: "ord-002",
      doctorName: "Dr. Priya Sharma",
      hospitalName: "Apollo Clinic",
      orderDate: new Date(2024, 0, 18),
      products: [
        { productName: "Omeprazole 20mg", qty: 200, price: 35, total: 7000 },
      ],
      totalValue: 7000,
      notes: "",
      status: "pending",
      createdAt: new Date(2024, 0, 18, 14, 15),
    },
    {
      id: "ord-003",
      doctorName: "Dr. Amit Patel",
      hospitalName: "Fortis Healthcare",
      orderDate: new Date(2024, 0, 20),
      products: [
        { productName: "Metformin 500mg", qty: 150, price: 30, total: 4500 },
        { productName: "Atorvastatin 10mg", qty: 100, price: 55, total: 5500 },
        { productName: "Amlodipine 5mg", qty: 80, price: 40, total: 3200 },
      ],
      totalValue: 13200,
      notes: "Monthly stock order",
      status: "pending",
      createdAt: new Date(2024, 0, 20, 9, 0),
    },
  ]);

  const stats = {
    totalOrders: orders.length,
    totalValue: orders.reduce((sum, o) => sum + o.totalValue, 0),
    pending: orders.filter(o => o.status === "pending").length,
    confirmed: orders.filter(o => o.status === "confirmed").length,
  };

  const handleAddOrder = (data: any) => {
    const newOrder: POBOrder = {
      id: `ord-${Date.now()}`,
      doctorName: data.doctorName,
      hospitalName: data.hospitalName,
      orderDate: data.orderDate,
      products: data.products,
      totalValue: data.totalValue,
      notes: data.notes,
      status: "pending",
      createdAt: new Date(),
    };

    setOrders([newOrder, ...orders]);
    toast({
      title: "Order Submitted",
      description: `Order worth ₹${newOrder.totalValue.toLocaleString()} has been submitted successfully.`,
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">Personal Order Booking</h1>
            <p className="text-muted-foreground">
              Record direct orders from Hospitals, Clinics, and Pharmacies. All orders are tracked and processed through the system.
            </p>
          </div>

          {/* Stats Cards */}
          <StatsCards {...stats} />

          {/* Search and Add Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by hospital or doctor name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add New POB Order
            </Button>
          </div>

          {/* Orders List */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Order History</h2>
            <POBList orders={orders} searchQuery={searchQuery} />
          </div>
        </div>

        {/* Add POB Modal */}
        <AddPOBModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddOrder}
        />
      </main>
    </div>
  );
};

export default POB;
