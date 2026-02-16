import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { VisitSearchBar } from "@/components/track-visits/VisitSearchBar";
import { AddVisitModal } from "@/components/track-visits/AddVisitModal";
import { VisitList } from "@/components/track-visits/VisitList";
import { useToast } from "@/hooks/use-toast";
import { fetchAllProducts, fetchAllStockists, fetchCompletedVisits, fetchMissedVisits, fetchTodaysVisits, markStockistVisit, markVisit, reMarkVisit } from "@/services/VisitService";
import { set } from "date-fns";
import { get } from "http";
import { StockistVisitData } from "@/components/track-visits/StockistVisitForm";
import { adaptBackendVisits, adaptBackendVisitsForMissed } from "@/lib/utils";
import { on } from "events";
import { ReMarkVisitModal } from "@/components/track-visits/ReMarkVisitModal";

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
  const [isReMarkModalOpen, setIsReMarkModalOpen] = useState(false);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [missedVisits, setMissedVisits] = useState<any[]>([]);
  const [selectedMissedVisit, setSelectedMissedVisit] = useState<Visit | null>(null);
  const [todaysVisits, setTodaysVisits] = useState<any[]>([]);
  const [allStockists, setAllStockists] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const { toast } = useToast();
  const feID = sessionStorage.getItem("feID");

  useEffect(() => {
    getTodaysVisits();
    getAllStockists();
    getCompletedVisits();
    getMissedVisits();
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
      setVisits(adaptBackendVisits(data, false));
      console.log("Completed Visits:", data);
    } catch (error) {
      console.error("Error fetching completed visits:", error);
    }

  };

  const getMissedVisits = async () => {
    if (!feID) return;
    try {
      const data = await fetchMissedVisits(Number(feID));
      console.log("Missed Visits Data from Backend:", data);
      setMissedVisits(adaptBackendVisitsForMissed(data));
      // console.log("Missed Visits:", adaptBackendVisitsForMissed(data, true));
    } catch (error) {
      console.error("Error fetching missed visits:", error);
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
      getCompletedVisits();
      toast({
        title: "Visit Marked",
        description: "Your visit has been marked successfully.",
      });
    } catch (error) {

    }
  };

  const handleReMarkVisit = async (data: any) => {
    console.log("Re-Marking Visit with data:", data);
    const newVisit = {
      visitId: data.visitId,
      status: data.isMissed ? "MISSED" : "COMPLETED",
      notes: data.notes,
      latitude: data.location?.lat,
      longitude: data.location?.lng,
      activitiesPerformed: data.activitiesPerformed,
      convertedProducts: data.convertedProducts,
    };
    try {
      await reMarkVisit(newVisit);
      getCompletedVisits();
      getMissedVisits();
      getTodaysVisits();
      toast({
        title: "Visit Re-Marked",
        description: "Your visit has been re-marked successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({ 
        title: error.response.data.message,
        description: "Failed to re-mark visit.",
        variant: "destructive",
      });
    }
    console.log("Visit Re-Marked:", newVisit);
  };


  const handleAddVisit = async (data: any) => {
    console.log("Adding Visit:", data);

    if (data.visitType === "STOCKIST") {
      await handleAddStockistVisit(data as StockistVisitData);
      return;
    }

    if(data.isPreviouslyMissed){
      handleReMarkVisit(data);
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
      getCompletedVisits();
      getMissedVisits();
      getTodaysVisits();
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

  const onReMarkVisit = () => {
    setIsReMarkModalOpen(true);
    toast({
      title: "Re-mark Visit",
      description: "Functionality to re-mark visit goes here.",
    });
  }


  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
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
              completedVisits={visits}
              missedVisits={missedVisits}
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

            {/* <ReMarkVisitModal
              isOpen={isReMarkModalOpen}
              onClose={() => setIsReMarkModalOpen(false)}
              onSubmit={handleAddVisit}
              selectedVisit={selectedMissedVisit}
              stockists={allStockists}
              products={allProducts}
            /> */}
          </div>
        </main>
      </div>
    </div>
  );
}
