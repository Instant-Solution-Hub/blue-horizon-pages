import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { VisitSearchBar } from "@/components/track-visits/VisitSearchBar";
import { AddVisitModal } from "@/components/track-visits/AddVisitModal";
import { VisitList } from "@/components/track-visits/VisitList";
import { useToast } from "@/hooks/use-toast";
import { fetchAllProducts, fetchAllStockists, fetchCompletedVisits, fetchTodaysVisits, markStockistVisit, markVisit } from "@/services/VisitService";
import { set } from "date-fns";
import { get } from "http";
import { StockistVisitData } from "@/components/track-visits/StockistVisitForm";
import { adaptBackendVisits } from "@/lib/utils";

interface Visit {
  id: string;
  visitType: "doctor" | "pharmacist" | "stockist";
  dateTime: Date;
  notes: string;
  isMissed?: boolean;
  activitiesPerformed: string[];
  [key: string]: unknown;
}



export default function TrackVisits() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [todaysVisits, setTodaysVisits] = useState<any[]>([]);
  const [allStockists, setAllStockists] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const { toast } = useToast();
  const feID = sessionStorage.getItem("feID");

  useEffect(() => {
    getTodaysVisits();
    getAllStockists();
    getCompletedVisits();
    getAllProducts();
  }, []);


  const getAllProducts = async () => {
    try {
      const response = await fetchAllProducts();
      console.log("All Products:", response);
      setAllProducts(response.data);
    } catch (error) {
    }
  }

  const getAllStockists = async () => {
    try {
      const response = await fetchAllStockists();
      console.log("All Stockists:", response);
      setAllStockists(response);
    } catch (error) {

    }
  }

  const getTodaysVisits = async () => {
    if (!feID) return;
    try {
      const data = await fetchTodaysVisits(Number(feID));
      setTodaysVisits(data);
      console.log("Today's Visits:", data);
    } catch (error) {
      console.error("Error fetching today's visits:", error);
    }
  };

  const getCompletedVisits = async () => {
    if (!feID) return;
    try {
      const data = await fetchCompletedVisits(Number(feID));
      setVisits(adaptBackendVisits(data))
      console.log("Completed Visits:", data);
    } catch (error) {
      console.error("Error fetching completed visits:", error);
    }

  };


  const handleAddStockistVisit = async (data: StockistVisitData) => {
    let obj = {
      "fieldExecutiveId": feID ? Number(feID) : 0,
      "stockistId": data.stockistId,
      "stockistType": data.stockistType,
      "weekNumber": Math.ceil((new Date().getDate()) / 7),
      "dayOfWeek": ((new Date().getDay() + 6) % 7) + 1,
      "status": "COMPLETED",
      "notes": data.notes,
      "activitiesPerformed": data.activitiesPerformed,
      "orderValue": data.orderValue,
      "location": ""
    }
    try {

      let response = await markStockistVisit(obj);
      toast({
        title: "Visit Marked",
        description: "Your visit has been marked successfully.",
      });
    } catch (error) {

    }
  };


const handleAddVisit = async (data: any) => {
  console.log("Adding Visit:", data);

  if (data.visitType === "STOCKIST") {
    await handleAddStockistVisit(data as StockistVisitData);
    return;
  }

  const newVisit = {
    visitId: data.visitId,
    status: data.isMissed ? "MISSED" : "COMPLETED",
    notes: data.notes,
    latitude: data.location?.lat,
    longitude: data.location?.lng,
    // latitude: 10.588423,
    // longitude: 76.686770,
    activitiesPerformed: data.activitiesPerformed,
    convertedProducts: data.convertedProducts,
  };

  try {
    await markVisit(newVisit);
    toast({
      title: "Visit Marked",
      description: "Your visit has been marked successfully.",
    });
  } catch (error) {
    console.error(error);
    toast({
      title: error.response.data.message,
      description: "Failed to mark visit.",
      variant: "destructive",
    });
  }

  console.log("New Visit Added:", newVisit);
};


  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Track Visits</h1>
              <p className="text-muted-foreground">
                Record and view all your completed visits
              </p>
            </div>

            <VisitSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterType={filterType}
              onFilterChange={setFilterType}
              onAddVisit={() => setIsModalOpen(true)}
            />

            <VisitList
              visits={visits}
              searchQuery={searchQuery}
              filterType={filterType}
            />

            <AddVisitModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleAddVisit}
              todaysVisits={todaysVisits}
              stockists={allStockists}
              products={allProducts}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
