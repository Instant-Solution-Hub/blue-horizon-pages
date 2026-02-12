import SuperAdminSidebar from "@/components/super-admin-dashboard/SuperAdminSidebar";
import ProductCard from "@/components/super-admin-products/ProductCard";
import { Package } from "lucide-react";

const mockProducts = [
  {
    name: "Amoxicillin 500mg",
    category: "Antibiotics",
    description: "Broad-spectrum antibiotic for bacterial infections",
    pts: 120.0,
    newPts: 125.0,
    price: 150.0,
    salesAmount: 45000.0,
  },
  {
    name: "Paracetamol 650mg",
    category: "Painkillers",
    description: "Pain relief and fever reduction",
    pts: 18.0,
    newPts: 20.0,
    price: 25.0,
    salesAmount: 78000.0,
  },
  {
    name: "Vitamin D3 60K",
    category: "Vitamins",
    description: "Cholecalciferol supplement for vitamin D deficiency",
    pts: 95.0,
    newPts: 100.0,
    price: 120.0,
    salesAmount: 32000.0,
  },
  {
    name: "Atorvastatin 10mg",
    category: "Cardiovascular",
    description: "Lipid-lowering agent for cholesterol management",
    pts: 85.0,
    newPts: 90.0,
    price: 110.0,
    salesAmount: 56000.0,
  },
  {
    name: "Metformin 500mg",
    category: "Diabetes",
    description: "First-line medication for type 2 diabetes mellitus",
    pts: 40.0,
    newPts: 42.0,
    price: 55.0,
    salesAmount: 91000.0,
  },
  {
    name: "Cetirizine 10mg",
    category: "Respiratory",
    description: "Antihistamine for allergic rhinitis and urticaria",
    pts: 22.0,
    newPts: 24.0,
    price: 30.0,
    salesAmount: 28000.0,
  },
];

const SuperAdminProducts = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <SuperAdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Page Title */}
          <div className="animate-fade-in bg-primary rounded-xl p-6 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-white/20 rounded-xl">
                <Package className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Products</h1>
            </div>
            <p className="text-white/80 ml-14">
              View all products with pricing and sales information
            </p>
          </div>

          {/* Product Cards Grid */}
          <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ animationDelay: "0.1s" }}>
            {mockProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminProducts;
