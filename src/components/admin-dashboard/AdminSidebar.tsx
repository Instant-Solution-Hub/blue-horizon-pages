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
  ShoppingBag,
  HeartHandshake,
  UsersRound,
  CalendarRange,
  BellDot,

} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Home", path: "/admin-dashboard" },
    { icon: CalendarRange, label: "Slots", path: "/admin-dashboard/slots" },
    { icon: UsersRound, label: "User Management", path: "/admin-dashboard/user-management" },
    { icon: Users, label: "Managers", path: "/admin-dashboard/managers" },
    { icon: Users, label: "Field Executives", path: "/admin-dashboard/field-executives" },
    { icon: Target, label: "Target Plan", path: "/admin-dashboard/target-plan" },
    { icon: ShoppingBag, label: "Products", path: "/admin-dashboard/products" },
    { icon: FileText, label: "Leave Requests", path: "/admin-dashboard/leave-requests" },
    { icon: UserPlus, label: "Manager Joining", path: "/admin-dashboard/manager-joining" },
    { icon: Package, label: "Stock Update", path: "/admin-dashboard/stock-update" },
    { icon: HeartHandshake, label: "Doctor Conversions", path: "/admin-dashboard/doctor-conversions" },
    { icon: Megaphone, label: "Promotions", path: "/admin-dashboard/promotions" },
    { icon: ClipboardCheck, label: "Compliance Visit", path: "/admin-dashboard/compliance" },
    { icon: TrendingUp, label: "Competitive Brands", path: "/admin-dashboard/competitive-brands" },
    { icon: TrendingUp, label: "Sales Progress", path: "/admin-dashboard/sales-progress" },
    { icon: BellDot, label: "Portal Requests", path: "/admin-portal-requests" },
    { icon: User, label: "Profile", path: "/admin-dashboard/profile" },
  ];

  return (
    <aside
      className={cn(
        "h-screen bg-[#3D53D1] flex flex-col transition-all duration-300 overflow-hidden",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#3D53D1] font-bold text-sm">LP</span>
            </div>
            <span className="font-semibold text-white">
              Larimar Pharma
            </span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-white" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-white" />
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
                  ? "bg-white text-[#3D53D1] shadow-sm"
                  : "text-white hover:bg-white/10"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive
                    ? "text-[#3D53D1]"
                    : "text-white group-hover:text-white"
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
        <div className="p-4 border-t border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#3D53D1] font-semibold text-sm">SA</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Super Admin
              </p>
              <p className="text-xs text-white/70 truncate">
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
