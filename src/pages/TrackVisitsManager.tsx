import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { VisitSearchBar } from "@/components/track-visits/VisitSearchBar";
import { AddVisitModal } from "@/components/track-visits/AddVisitModal";
import { VisitList } from "@/components/track-visits/VisitList";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchAllProducts, 
  fetchCompletedVisits, 
  fetchMissedVisits, 
  fetchTodaysVisits, 
  markVisit, 
  reMarkVisit,
  createUnscheduledVisit
} from "@/services/ManagerVisitService";
import { adaptBackendVisits } from "@/lib/utils";
import { AddManagerVisitModal } from "@/components/track-visits-manager/AddManagerVisitModal";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import ManagerHeader from "@/components/manager-dashboard/ManagerHeader";
import { fetchAllDoctors } from "@/services/DoctorService";

interface Visit {
  id: string;
  visitType: "doctor";
  dateTime: Date;
  notes: string;
  isMissed?: boolean;
  activitiesPerformed: string[];
  doctorName?: string;
  [key: string]: unknown;
}

interface DoctorData {
  id: number;
  name: string;
  specialization?: string;
  [key: string]: unknown;
}

interface UnscheduledVisitData {
  doctorId: number;
  dateTime: Date;
  notes: string;
  activitiesPerformed: string[];
  convertedProducts?: number[];
  isMissed?: boolean;
}

export default function TrackVisitsManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visits, setVisits] = useState<any[]>([]);
  const [missedVisits, setMissedVisits] = useState<Visit[]>([]);
  const [todaysVisits, setTodaysVisits] = useState<any[]>([]);
  const [allDoctors, setAllDoctors] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const { toast } = useToast();
  const managerId = sessionStorage.getItem("userID"); // Assuming manager ID is stored differently

  useEffect(() => {
    getTodaysVisits();
    getCompletedVisits();
    getMissedVisits();
    getAllProducts();
    // Fetch doctors for unscheduled visits
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
     const response = await fetchAllDoctors();
      setAllDoctors(response);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const getAllProducts = async () => {
    try {
      const response = await fetchAllProducts();
      setAllProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const getTodaysVisits = async () => {
    if (!managerId) return;
    try {
      const data = await fetchTodaysVisits(Number(managerId));
      setTodaysVisits(data);
    } catch (error) {
      console.error("Error fetching today's visits:", error);
    }
  };

  const getCompletedVisits = async () => {
    if (!managerId) return;
    try {
      const data = await fetchCompletedVisits(Number(managerId));
      setVisits(adaptBackendVisits(data, false));
    } catch (error) {
      console.error("Error fetching completed visits:", error);
    }
  };

  const getMissedVisits = async () => {
    if (!managerId) return;
    try {
      const data = await fetchMissedVisits(Number(managerId));
    //   setMissedVisits(adaptBackendVisits(data, true));
    } catch (error) {
      console.error("Error fetching missed visits:", error);
    }
  };

  const handleCreateUnscheduledVisit = async (data: UnscheduledVisitData) => {
    try {
      console.log("Creating Unscheduled Visit with data:", data);
      const response = await createUnscheduledVisit({
        managerId: Number(managerId),
        doctorId: data.doctorId,
        notes: data.notes,
        activitiesPerformed: data.activitiesPerformed,
      });

      getTodaysVisits();
      getCompletedVisits();
      getMissedVisits();

      // Then mark the newly created visit
      // await handleMarkVisit({
      //   visitId: response.data.id,
      //   isMissed: false,
      //   notes: data.notes,
      //   activitiesPerformed: data.activitiesPerformed,
      //   convertedProducts: data.convertedProducts
      // });

      toast({
        title: "Visit Created and Marked",
        description: "Unscheduled visit has been created and marked successfully.",
      });
    } catch (error) {
      console.error("Error creating unscheduled visit:", error);
      toast({
        title: "Error",
        description: "Failed to create unscheduled visit.",
        variant: "destructive",
      });
    }
  };

  const handleMarkVisit = async (data: any) => {
    console.log("Marking Visit:", data);

    // Handle re-marking of missed visits
    if (data.isPreviouslyMissed) {
      return await handleReMarkVisit(data);
    }

    const visitData = {
      visitId: data.visitId,
      status: data.isMissed ? "MISSED" : "COMPLETED",
      notes: data.notes,
      // No location data for manager
      activitiesPerformed: data.activitiesPerformed,
      convertedProducts: data.convertedProducts,
    };

    try {
      await markVisit(visitData);
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
        title: "Error",
        description: "Failed to mark visit.",
        variant: "destructive",
      });
    }
  };

  const handleReMarkVisit = async (data: any) => {
    const visitData = {
      visitId: data.visitId,
      status: data.isMissed ? "MISSED" : "COMPLETED",
      notes: data.notes,
      // No location data for manager
      activitiesPerformed: data.activitiesPerformed,
      convertedProducts: data.convertedProducts,
    };

    try {
      await reMarkVisit(visitData);
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
        title: "Error",
        description: "Failed to re-mark visit.",
        variant: "destructive",
      });
    }
  };

  const handleAddVisit = async (data: any) => {
    console.log("Adding Visit:", data);

    // Check if this is an unscheduled visit (no visitId provided)
    if (!data.visitId && data.doctorId) {
      return await handleCreateUnscheduledVisit(data as UnscheduledVisitData);
    }

    // Otherwise, it's a scheduled visit that needs to be marked
    await handleMarkVisit(data);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ManagerSidebar />
      <div className="flex-1 flex flex-col">
        <ManagerHeader />
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Track Visits</h1>
              <p className="text-muted-foreground">
                Record and view all your completed visits
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Manager Mode: Doctor visits only • No location required • Can create unscheduled visits
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
            //   userType="manager"
            />

            <AddManagerVisitModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleAddVisit}
              todaysVisits={todaysVisits.concat(missedVisits)}
              doctors={allDoctors} // Passing doctors instead of stockists
              products={allProducts}
            />
          </div>
        </main>
      </div>
    </div>
  );
}