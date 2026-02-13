import { useEffect, useState } from "react";
import SuperAdminSidebar from "@/components/super-admin-dashboard/SuperAdminSidebar";
import ProductCard from "@/components/super-admin-products/ProductCard";
import { Package } from "lucide-react";
import { fetchProductSummary } from "@/services/ProductService"; // adjust path if needed

interface ProductSummary {
  productName: string;
  category: string;
  description: string;
  pts: number;
  ptr: number;
  price: number;
  totalSales: number;
}

const SuperAdminProducts = () => {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductSummary();
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to fetch product summary:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

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
          <div
            className="animate-fade-in grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            style={{ animationDelay: "0.1s" }}
          >
            {loading ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No products found
              </div>
            ) : (
              products.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminProducts;
