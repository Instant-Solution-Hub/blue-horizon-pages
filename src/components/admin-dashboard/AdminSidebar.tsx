import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Target,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ClipboardCheck,
  Package,
  UserPlus,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Home", path: "/admin-dashboard" },
    { icon: Users, label: "Managers", path: "/admin-dashboard/managers" },
    { icon: Users, label: "Field Executives", path: "/admin-dashboard/field-executives" },
    { icon: Target, label: "Target Plan", path: "/admin-dashboard/target-plan" },
    { icon: FileText, label: "Leave Requests", path: "/admin-dashboard/leave-requests" },
    { icon: UserPlus, label: "Manager Joining", path: "/admin-dashboard/manager-joining" },
    { icon: Package, label: "Stock Update", path: "/admin-dashboard/stock-update" },
    { icon: Megaphone, label: "Promotions", path: "/admin-dashboard/promotions" },
    { icon: ClipboardCheck, label: "Compliance Visit", path: "/admin-dashboard/compliance" },
     { icon: TrendingUp, label: "Competitive Brands", path: "/admin-dashboard/competitive-brands" },
    { icon: TrendingUp, label: "Sales Progress", path: "/admin-dashboard/sales-progress" },
    { icon: User, label: "Profile", path: "/admin-dashboard/profile" },
  ];

  return (
    <aside
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col transition-all duration-300 overflow-hidden",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">LP</span>
            </div>
            <span className="font-display font-semibold text-foreground">
              Larimar Pharma
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-accent transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">SA</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                Super Admin
              </p>
              <p className="text-xs text-muted-foreground truncate">
                admin@larimarpharma.com
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;
