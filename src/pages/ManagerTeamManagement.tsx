import { useState, useMemo, useEffect } from "react";
import { Users } from "lucide-react";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import ManagerHeader from "@/components/manager-dashboard/ManagerHeader";
import TeamSearchBar from "@/components/manager-team/TeamSearchBar";
import TeamMemberCard from "@/components/manager-team/TeamMemberCard";
import ViewVisitsModal from "@/components/manager-team/ViewVisitsModal";
import { fetchManagerTeamMembers } from "@/services/ManagerService";

interface Visit {
  id: string;
  doctorName: string;
  specialization: string;
  location: string;
  time: string;
  status: "completed" | "pending" | "missed";
}

interface TeamMember {
  id: string;
  name: string;
  market: string;
  headquarters: string;
  email: string;
  todayVisitCount: number;
  targetProgress: number;
  visits: Visit[];
}

const ManagerTeamManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = sessionStorage.getItem("userID") || "1";


  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchManagerTeamMembers(Number(userId));
      setTeamMembers(response.data);
    } catch (err) {
      setError("Failed to load team members. Please try again.");
    } finally {
      setIsLoading(false);
    } 
  };

  const filteredMembers = teamMembers.filter(member => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(query) ||
      member.market.toLowerCase().includes(query) ||
      member.headquarters.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query)
    );
  });


  const handleViewVisits = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ManagerHeader />

        <main className="flex-1 p-6 overflow-y-auto">
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
                Showing {filteredMembers.length} of {teamMembers.length} team members
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
