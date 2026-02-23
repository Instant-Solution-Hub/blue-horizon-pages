 import { useState, useEffect } from "react";
 import { Plus } from "lucide-react";
 import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
 import { Button } from "@/components/ui/button";
 import ProductList from "@/components/admin-products/ProductList";
 import AddProductModal from "@/components/admin-products/AddProductModal";
 import UpdateProductModal from "@/components/admin-products/UpdateProductModal";
 import { useToast } from "@/hooks/use-toast";
 import { Product, getProducts, createProduct, updateProduct } from "@/services/ProductService";
 

 
 const categories = [
   "Antibiotics",
   "Painkillers",
   "Vitamins",
   "Cardiovascular",
   "Diabetes",
   "Respiratory",
   "Gastrointestinal",
   "Dermatology",
   "Neurology",
   "Other",
 ];
 
 // initial empty state (products will be fetched from backend)
 
 const AdminProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
   const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
 
   const handleAddProduct = async (productData: Omit<Product, "id">) => {
     try {
       setLoading(true);
       const created = await createProduct(productData);
       setProducts((prev) => [created, ...prev]);
       toast({
         title: "Product Added",
         description: `${created.name} has been added successfully.`,
       });
     } catch (err) {
       console.error("Failed to add product", err);
       toast({
         title: "Error",
         description: "Failed to add product. Please try again.",
       });
     } finally {
       setLoading(false);
     }
   };
 
   const handleUpdateProduct = async (updatedProduct: Product) => {
     try {
       setLoading(true);
       const payload = {
         name: updatedProduct.name,
         description: updatedProduct.description,
         category: updatedProduct.category,
         price: updatedProduct.price,
         pts: updatedProduct.pts,
         ptr: updatedProduct.ptr,
         newPts: updatedProduct.newPts
       };
       const updated = await updateProduct(updatedProduct.id, payload);
       setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
       toast({
         title: "Product Updated",
         description: `${updated.name} has been updated successfully.`,
       });
     } catch (err) {
       console.error("Failed to update product", err);
       toast({
         title: "Error",
         description: "Failed to update product. Please try again.",
       });
     } finally {
       setLoading(false);
     }
   };
 
   const handleEditClick = (product: Product) => {
     setSelectedProduct(product);
     setIsUpdateModalOpen(true);
   };
 
   useEffect(() => {
     const load = async () => {
       try {
         setLoading(true);
         const data = await getProducts();
         setProducts(Array.isArray(data) ? data : []);
       } catch (err) {
         console.error("Failed to fetch products", err);
         toast({ title: "Error", description: "Failed to load products." });
       } finally {
         setLoading(false);
       }
     };

     load();
   }, []);

   return (
     <div className="h-screen bg-background flex overflow-hidden">
       <AdminSidebar />
       <div className="flex-1 flex flex-col overflow-hidden">
         <main className="flex-1 p-6 overflow-y-auto">
         <div className="mb-6">
           <h1 className="text-2xl font-bold text-foreground">Products</h1>
           <p className="text-muted-foreground">
             Manage your product catalog
           </p>
         </div>
 
         <div className="flex justify-end mb-4">
           <Button onClick={() => setIsAddModalOpen(true)}>
             <Plus className="h-4 w-4 mr-2" />
             Add Product
           </Button>
         </div>
 
         <ProductList products={products} onEdit={handleEditClick} />
 
         <AddProductModal
           open={isAddModalOpen}
           onOpenChange={setIsAddModalOpen}
           onAdd={handleAddProduct}
           categories={categories}
         />
 
         <UpdateProductModal
           open={isUpdateModalOpen}
           onOpenChange={setIsUpdateModalOpen}
           onUpdate={handleUpdateProduct}
           product={selectedProduct}
           categories={categories}
         />
       </main>
       </div>
     </div>
   );
 };
 
 export default AdminProducts;