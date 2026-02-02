import { cn } from "@/lib/utils";
import { 
  Home, 
  Calendar, 
  MapPin, 
  Users, 
  ClipboardCheck,
  User,
  BarChart3,
  Pill,
  LogOut,
  ChevronLeft,
  ChevronRight,

  FileText,
  Target

} from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", href: "/manager-dashboard" },
  { icon: Calendar, label: "Slot Planning", href: "/manager-dashboard/slot-planning" },
  { icon: MapPin, label: "Track Visits", href: "/manager-dashboard/track-visits" },
  { icon: Users, label: "Team Management", href: "/manager-dashboard/team" },
  { icon: Target, label: "Target Plan", href: "/manager-dashboard/target-plan" },
  { icon: FileText, label: "Leave Requests", href: "/manager-dashboard/leave-requests" },
  { icon: ClipboardCheck, label: "Compliance Visit", href: "/manager-dashboard/visit-compliance" },
    { icon: ClipboardCheck, label: "Manager Joining", href: "/manager-dashboard/manager-joining" },
  { icon: User, label: "Profile", href: "/manager-dashboard/profile" },
  { icon: BarChart3, label: "Sales Progress", href: "/manager-dashboard/sales-progress" },
];

const ManagerSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside
      className={cn(
        "h-screen bg-primary text-primary-foreground flex flex-col transition-all duration-300 sticky top-0",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-foreground rounded-xl flex items-center justify-center flex-shrink-0">
            <Pill className="w-6 h-6 text-primary" />
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in">
              <h1 className="font-display font-bold text-lg leading-tight">Larimar</h1>
              <p className="text-primary-foreground/70 text-xs">Pharma</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-primary-foreground text-primary rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform z-10"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href}>
                <button
                  onClick={() => navigate(item.href)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-primary-foreground text-primary font-medium shadow-md" 
                      : "text-primary-foreground/80 hover:bg-sidebar-accent hover:text-primary-foreground"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
                  {!isCollapsed && (
                    <span className="text-sm truncate animate-fade-in">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-primary-foreground/80 hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default ManagerSidebar;
