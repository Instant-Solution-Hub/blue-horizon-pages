import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, Pill } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/services/AuthenticationService";
import { checkPortalStatus } from "@/services/PortalService";
import PortalLockedPage from "./PortalLockedPage";
type InitState = "loading" | "locked" | "ready";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<InitState>("loading");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await login(email, password);
      console.log("Login Response: ", response);
      setIsLoading(false);
      if (response.success) {
        sessionStorage.setItem("userID", response.data.id);
        sessionStorage.setItem("feID", response.data.id);
        sessionStorage.setItem("userName", response.data.name);
        sessionStorage.setItem("userEmail", response.data.email);
        sessionStorage.setItem("userRole", response.data.userType);
        toast({
          title: "Login Successful",
          description: ``,
        });
        console.log("User Type: ", response.data.userType);
        if (response.data.userType.toLowerCase() === "manager") {
          navigate("/manager-dashboard");
          return;
        }
        if (response.data.userType.toLowerCase() === "admin") {
          navigate("/admin-dashboard/profile");
          return;
        }
         
        if (response.data.userType.toLowerCase() === "super_admin") {
          navigate("/super-admin-dashboard/sales-progress");
          return;
        }
        navigate("/dashboard");
      }

    } catch (error) {
      setIsLoading(false);

      if (error.response?.status === 423) {
        const userIdentity = error.response.data.data;

        sessionStorage.setItem("userID", userIdentity.userId);
        sessionStorage.setItem("userRole", userIdentity.userType == "MANAGER" ? "Manager" : "FE");
        navigate("/portal-locked");
      }

      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const checkPortalStatusBeforeNavigating = async () => {
    try {
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

  if (state === "locked") {
    return <PortalLockedPage />;
  }


return (
 
    
   <div className="min-h-screen grid lg:grid-cols-2">

      {/* LEFT SIDE - BRANDING */}
   
<div className="hidden lg:flex flex-col items-center justify-center bg-primary text-primary-foreground relative overflow-hidden">

  <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80"></div>

  <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
  <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>

  <div className="relative z-10 flex flex-col items-center text-center space-y-10 px-10">

    <div className="w-44 h-44 bg-white rounded-3xl shadow-2xl flex items-center justify-center p-6">
      <img
        src="/LOGO.jpg"
        alt="Larimar Pharma"
        className="w-full h-full object-contain"
      />
    </div>

    <div>
      <h1 className="text-4xl font-bold">Larimar Pharma</h1>
      <p className="text-primary-foreground/80 text-lg mt-2">
        Field Force Management Portal
      </p>
    </div>
     <div className="grid grid-cols-2 gap-4 max-w-sm mt-4">
      {[
        "Doctor Visit Tracking",
        "Pharmacy Interaction",
        "Sales Monitoring",
        "Manager Insights",
      ].map((item, i) => (
        <div
          key={i}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-sm font-medium"
        >
          {item}
        </div>
      ))}
    </div>

  </div>
</div>
<div className="flex items-center justify-center bg-muted/30 p-8">

  <div className="w-full max-w-md">

      {/* RIGHT SIDE - LOGIN CARD */}
      <Card className="shadow-2xl border-0">
        <CardHeader className="space-y-4 text-center">

          {/* MOBILE / TABLET LOGO */}
          <div className="flex justify-center lg:hidden">
            <div className="w-24 h-24 rounded-2xl bg-white shadow-lg flex items-center justify-center p-3">
              <img
                src="/LOGO.jpg"
                alt="Larimar Pharma"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <CardTitle className="text-2xl font-bold">
            Welcome Back
          </CardTitle>

          <CardDescription>
            Sign in to access your dashboard
          </CardDescription>

        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

              </div>
            </div>

            {/* LOGIN BUTTON */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

          </form>
           <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Need help?{" "}
                  <button className="text-primary hover:text-primary/80 font-medium transition-colors">
                    Contact Support
                  </button>
                </p>
              </div>

        </CardContent>
      </Card>
        <p className="text-center text-xs text-muted-foreground mt-6">
            © 2026 Larimar Pharma. All rights reserved.
          </p>
    </div>
    </div>
     </div>
  

);
};

export default Login;