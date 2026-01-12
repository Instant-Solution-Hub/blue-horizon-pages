import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StatsCards from "@/components/pob/StatsCards";
import AddPOBModal, { POBFormData } from "@/components/pob/AddPOBModal";
import POBList, { POBOrder } from "@/components/pob/POBList";
import { createPOBOrder , getPOBOrders ,mapOrderResponseToPOBOrder , updatePOBOrder } from "@/services/POBService";

const POB = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingOrder, setEditingOrder] = useState<POBOrder | null>(null);
  const [orders, setOrders] = useState<POBOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);



  const stats = {
    totalOrders: orders.length,
    totalValue: orders.reduce((sum, o) => sum + o.totalValue, 0),
    pending: orders.filter(o => o.status === "pending").length,
    confirmed: orders.filter(o => o.status === "confirmed").length,
  };
  const feId = Number(localStorage.getItem("feId")) || 1;

  const fetchOrders = async () => {
  try {
    setLoadingOrders(true);
    const res = await getPOBOrders(feId);
    const apiOrders = res.data;
    const mappedOrders = apiOrders.map(mapOrderResponseToPOBOrder);

    setOrders(mappedOrders);
    console.log(res.data);
    console.log(res);
  } catch (err) {
    console.error("Failed to fetch orders", err);
  } finally {
    setLoadingOrders(false);
  }
};

useEffect(() => {
  fetchOrders();
}, []);


  const handleAddOrder = async (data: POBFormData) => {
  try {
    console.log(data.items);
      if (editingOrder) {
      // 🔁 UPDATE
      await updatePOBOrder(feId, editingOrder.id, data);

      toast({
        title: "Order Updated",
        description: "Order has been updated successfully",
      });
    } else {
      // ➕ CREATE
      await createPOBOrder(feId, data);

      toast({
        title: "POB Submitted",
        description: "Order has been submitted successfully",
      });
    }
    setIsModalOpen(false);
    await fetchOrders(); // same pattern as manager joinings
  } catch (err) {
   toast({
      title: "Error",
      description: editingOrder
        ? "Failed to update order"
        : "Failed to submit order",
      variant: "destructive",
    });
  }
};


  const handleEdit = (order: POBOrder) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">Personal Order Booking</h1>
            <p className="text-sm text-muted-foreground">
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
            <POBList orders={orders} searchQuery={searchQuery} onEdit={handleEdit} />
          </div>
        </div>

        {/* Add/Edit POB Modal */}
       <AddPOBModal
  isOpen={isModalOpen}
  onClose={handleCloseModal}
  onSubmit={handleAddOrder}
editData={
  editingOrder
    ? {
        institutionName: editingOrder.hospitalName,
        institutionType: "HOSPITAL",
        contactPerson: editingOrder.doctorName,
        contactNumber: "9999999999",
        orderDate: editingOrder.orderDate,
        discount: editingOrder.discount || 0,
        notes: editingOrder.notes,
        totalAmount:editingOrder.totalValue,
        items: editingOrder.products.map(p => ({
          productId: p.id,   
          quantity: p.qty,      
          price: p.price,
          total: p.total,
        })),
      }
    : null
}
/>

      </main>
    </div>
  );
};

export default POB;