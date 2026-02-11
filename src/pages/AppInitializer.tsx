// src/components/AppInitializer.tsx
import { useEffect, useState } from "react";
import { checkPortalStatus } from "@/services/PortalService";
import PortalLockedPage from "@/pages/PortalLockedPage";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/Spinner";

type InitState = "loading" | "locked" | "ready";

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<InitState>("loading");
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
    // if there is no userId or userType in sessionStorage, navigate to login
    if (!sessionStorage.getItem("userID") || !sessionStorage.getItem("userRole")) {
        navigate("/");
        throw new Error("User not authenticated");
    }
        const res = await checkPortalStatus();

        if (res.isLocked) {
          setState("locked");
        } else {
          setState("ready");
        }
      } catch (err) {
        console.error("Portal status check failed", err);
        // optional: allow app or show error page
        setState("ready");
      }
    };

    init();
  }, []);

  if (state === "loading") {
    return <div className="h-screen flex flex-col items-center justify-center text-center px-4">
        <Spinner/>
    </div>
  }

  if (state === "locked") {
    return <PortalLockedPage />;
  }

  return <>{children}</>;
};

export default AppInitializer;
