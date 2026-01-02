import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { VisitSearchBar } from "@/components/track-visits/VisitSearchBar";
import { AddVisitModal } from "@/components/track-visits/AddVisitModal";
import { VisitList } from "@/components/track-visits/VisitList";
import { useToast } from "@/hooks/use-toast";

interface Visit {
  id: string;
  visitType: "doctor" | "pharmacist" | "stockist";
  dateTime: Date;
  notes: string;
  isMissed?: boolean;
  activitiesPerformed: string[];
  [key: string]: unknown;
}

// Mock data for demonstration
const mockVisits: Visit[] = [
  {
    id: "1",
    visitType: "doctor",
    doctorName: "Dr. Rahul Sharma",
    designation: "Cardiologist",
    category: "A+",
    practiceType: "Consultant",
    hospital: "City Hospital",
    location: { lat: 28.6139, lng: 77.209 },
    dateTime: new Date(2026, 0, 2, 10, 30),
    activitiesPerformed: ["Product Detailing", "Sample Distribution"],
    notes: "Discussed new cardiac medication",
    isMissed: false,
  },
  {
    id: "2",
    visitType: "pharmacist",
    pharmacyName: "MedPlus Pharmacy",
    contactPerson: "Ramesh Gupta",
    contactNumber: "9876543210",
    dateTime: new Date(2026, 0, 2, 14, 0),
    activitiesPerformed: ["Offer", "Expiry"],
    notes: "Renewed stock order",
    isMissed: false,
  },
  {
    id: "3",
    visitType: "stockist",
    stockistName: "MedSupply India",
    stockistType: "Super stockist",
    contactPerson: "Rajesh Kumar",
    contactNumber: "9876543211",
    location: { lat: 28.6149, lng: 77.21 },
    dateTime: new Date(2026, 0, 1, 11, 0),
    activitiesPerformed: ["Sales Order", "Payment Collection"],
    orderValue: "50000",
    notes: "Large order placed for Q1",
    isMissed: false,
  },
  {
    id: "4",
    visitType: "doctor",
    doctorName: "Dr. Priya Patel",
    designation: "Neurologist",
    category: "A",
    practiceType: "Visiting",
    hospital: "Apollo Clinic",
    location: null,
    dateTime: new Date(2026, 0, 1, 9, 0),
    activitiesPerformed: [],
    notes: "Doctor was not available",
    isMissed: true,
  },
];

export default function TrackVisits() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visits, setVisits] = useState<Visit[]>(mockVisits);
  const { toast } = useToast();

  const handleAddVisit = (data: any) => {
    const newVisit: Visit = {
      ...data,
      id: Date.now().toString(),
      dateTime: new Date(),
    };
    setVisits((prev) => [newVisit, ...prev]);
    toast({
      title: "Visit Added",
      description: "Your visit has been recorded successfully.",
    });
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
            />
          </div>
        </main>
      </div>
    </div>
  );
}
