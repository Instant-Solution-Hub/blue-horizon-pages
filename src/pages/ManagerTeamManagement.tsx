import { useState, useMemo } from "react";
import { Users } from "lucide-react";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import ManagerHeader from "@/components/manager-dashboard/ManagerHeader";
import TeamSearchBar from "@/components/manager-team/TeamSearchBar";
import TeamMemberCard from "@/components/manager-team/TeamMemberCard";
import ViewVisitsModal from "@/components/manager-team/ViewVisitsModal";

// Mock data for team members
const mockTeamMembers = [
  {
    id: "1",
    name: "Rahul Sharma",
    market: "Mumbai",
    headquarters: "Andheri West",
    email: "rahul.sharma@company.com",
    todayVisitCount: 8,
    targetProgress: 85,
    visits: [
      { id: "v1", doctorName: "Dr. Priya Patel", specialization: "Cardiologist", location: "Andheri", time: "09:00 AM", status: "completed" as const },
      { id: "v2", doctorName: "Dr. Amit Singh", specialization: "General Physician", location: "Bandra", time: "10:30 AM", status: "completed" as const },
      { id: "v3", doctorName: "Dr. Neha Gupta", specialization: "Dermatologist", location: "Juhu", time: "12:00 PM", status: "completed" as const },
      { id: "v4", doctorName: "Dr. Rajesh Kumar", specialization: "Orthopedic", location: "Versova", time: "02:00 PM", status: "pending" as const },
      { id: "v5", doctorName: "Dr. Sanjay Mehta", specialization: "Neurologist", location: "Vile Parle", time: "03:30 PM", status: "pending" as const },
    ],
  },
  {
    id: "2",
    name: "Priya Desai",
    market: "Mumbai",
    headquarters: "Borivali",
    email: "priya.desai@company.com",
    todayVisitCount: 6,
    targetProgress: 72,
    visits: [
      { id: "v6", doctorName: "Dr. Kavita Joshi", specialization: "Pediatrician", location: "Borivali", time: "09:30 AM", status: "completed" as const },
      { id: "v7", doctorName: "Dr. Suresh Nair", specialization: "ENT Specialist", location: "Kandivali", time: "11:00 AM", status: "completed" as const },
      { id: "v8", doctorName: "Dr. Meera Shah", specialization: "Gynecologist", location: "Malad", time: "01:00 PM", status: "pending" as const },
    ],
  },
  {
    id: "3",
    name: "Amit Verma",
    market: "Pune",
    headquarters: "Koregaon Park",
    email: "amit.verma@company.com",
    todayVisitCount: 10,
    targetProgress: 95,
    visits: [
      { id: "v9", doctorName: "Dr. Ravi Kulkarni", specialization: "Cardiologist", location: "Koregaon Park", time: "09:00 AM", status: "completed" as const },
      { id: "v10", doctorName: "Dr. Anjali Deshpande", specialization: "Diabetologist", location: "Kalyani Nagar", time: "10:00 AM", status: "completed" as const },
      { id: "v11", doctorName: "Dr. Vikram Patil", specialization: "Pulmonologist", location: "Viman Nagar", time: "11:30 AM", status: "completed" as const },
      { id: "v12", doctorName: "Dr. Sneha Jain", specialization: "Ophthalmologist", location: "Aundh", time: "02:30 PM", status: "pending" as const },
    ],
  },
  {
    id: "4",
    name: "Sneha Iyer",
    market: "Pune",
    headquarters: "Hadapsar",
    email: "sneha.iyer@company.com",
    todayVisitCount: 4,
    targetProgress: 48,
    visits: [
      { id: "v13", doctorName: "Dr. Arun Reddy", specialization: "Gastroenterologist", location: "Hadapsar", time: "10:00 AM", status: "completed" as const },
      { id: "v14", doctorName: "Dr. Pooja Sharma", specialization: "Psychiatrist", location: "Magarpatta", time: "11:30 AM", status: "missed" as const },
    ],
  },
  {
    id: "5",
    name: "Vikram Patil",
    market: "Nashik",
    headquarters: "College Road",
    email: "vikram.patil@company.com",
    todayVisitCount: 7,
    targetProgress: 78,
    visits: [
      { id: "v15", doctorName: "Dr. Mahesh Bhosale", specialization: "Urologist", location: "College Road", time: "09:00 AM", status: "completed" as const },
      { id: "v16", doctorName: "Dr. Sunita Wagh", specialization: "Endocrinologist", location: "Gangapur Road", time: "10:30 AM", status: "completed" as const },
      { id: "v17", doctorName: "Dr. Rajendra More", specialization: "Nephrologist", location: "Satpur", time: "12:00 PM", status: "pending" as const },
    ],
  },
];

const ManagerTeamManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<typeof mockTeamMembers[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return mockTeamMembers;
    
    const query = searchQuery.toLowerCase();
    return mockTeamMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(query) ||
        member.market.toLowerCase().includes(query) ||
        member.headquarters.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleViewVisits = (member: typeof mockTeamMembers[0]) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <ManagerSidebar />
      
      <div className="flex-1 flex flex-col">
        <ManagerHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-display font-bold text-foreground">
                Team Management
              </h1>
            </div>
            <p className="text-muted-foreground">
              View and manage your team members' performance and daily visits.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <TeamSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Team Members List */}
          <div className="space-y-4">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No team members found matching your search.
              </div>
            ) : (
              filteredMembers.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  name={member.name}
                  market={member.market}
                  headquarters={member.headquarters}
                  email={member.email}
                  todayVisitCount={member.todayVisitCount}
                  targetProgress={member.targetProgress}
                  onViewVisits={() => handleViewVisits(member)}
                />
              ))
            )}
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredMembers.length} of {mockTeamMembers.length} team members
          </div>
        </main>
      </div>

      {/* View Visits Modal */}
      {selectedMember && (
        <ViewVisitsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          memberName={selectedMember.name}
          visits={selectedMember.visits}
        />
      )}
    </div>
  );
};

export default ManagerTeamManagement;
