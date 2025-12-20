import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import ScheduleItem from "@/components/dashboard/ScheduleItem";
import { Stethoscope, Building2, Package, TrendingUp } from "lucide-react";

const scheduleData = [
  {
    name: "Dr. Sarah Johnson - Product Presentation",
    time: "09:00 AM",
    type: "doctor" as const,
  },
  {
    name: "MediCare Pharmacy - Offer Discussion",
    time: "11:00 AM",
    type: "pharmacy" as const,
  },
  {
    name: "ABC Stockist - Sales Order",
    time: "02:00 PM",
    type: "stockist" as const,
  },
  {
    name: "Dr. Michael Brown - Camp Planning",
    time: "04:00 PM",
    type: "doctor" as const,
  },
];

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6 overflow-auto">
          {/* Stats Section */}
          <section className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Doctor Visits"
                value={12}
                icon={Stethoscope}
                iconColor="text-primary"
                iconBgColor="bg-primary/10"
                className="animate-fade-in"
                style={{ animationDelay: "0.1s" } as React.CSSProperties}
              />
              <StatsCard
                title="Pharmacy Visits"
                value={8}
                icon={Building2}
                iconColor="text-success"
                iconBgColor="bg-success/10"
                className="animate-fade-in"
                style={{ animationDelay: "0.2s" } as React.CSSProperties}
              />
              <StatsCard
                title="Stockist Visits"
                value={5}
                icon={Package}
                iconColor="text-stockist"
                iconBgColor="bg-stockist/10"
                className="animate-fade-in"
                style={{ animationDelay: "0.3s" } as React.CSSProperties}
              />
              <StatsCard
                title="Target Progress"
                value="68%"
                icon={TrendingUp}
                iconColor="text-primary"
                iconBgColor="bg-primary/10"
                trend="+5% from last week"
                className="animate-fade-in"
                style={{ animationDelay: "0.4s" } as React.CSSProperties}
              />
            </div>
          </section>

          {/* Today's Schedule */}
          <section className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="bg-card rounded-xl border border-border card-shadow">
              <div className="p-5 border-b border-border">
                <h2 className="text-lg font-display font-semibold text-foreground">
                  Today's Schedule
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Your planned visits for today
                </p>
              </div>
              
              <div className="p-4 space-y-3">
                {scheduleData.map((item, index) => (
                  <ScheduleItem
                    key={index}
                    name={item.name}
                    time={item.time}
                    type={item.type}
                  />
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;