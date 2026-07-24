// src/components/AppInitializer.tsx
import { useEffect, useState } from "react";
import { checkPortalStatus } from "@/services/PortalService";
import PortalLockedPage from "@/pages/PortalLockedPage";
import { useLocation, useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner";

type InitState = "loading" | "locked" | "ready";

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<InitState>("loading");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
  const init = async () => {
    try {
      // Check authentication
      const userId = sessionStorage.getItem("userID");
      const userRole = sessionStorage.getItem("userRole")?.toLowerCase();

      if (!userId || !userRole) {
        navigate("/");
        throw new Error("User not authenticated");
      }

      // Skip portal status check for Admin and Super Admin
      if (userRole === "admin" || userRole === "super_admin") {
        setState("ready");
        return;
      }

      const res = await checkPortalStatus();

      if (res.isLocked) {
        setState("locked");
        navigate("/portal-locked");
      } else {
        setState("ready");

        if (location.pathname.match(/^\/portal-locked/)) {
          if (userRole === "manager") {
            navigate("/manager-dashboard");
          } else if (userRole === "fe") {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        }
      }
    } catch (err) {
      console.error("Portal status check failed", err);
      setState("ready");
    }
  };

  init();
}, [location.pathname]);

  if (state === "loading") {
    return <div className="h-screen flex flex-col items-center justify-center text-center px-4">
      <Spinner />
    </div>
  }

  if (state === "locked") {
    return <PortalLockedPage />;
  }

  return <>{children}</>;
};

export default AppInitializer;
