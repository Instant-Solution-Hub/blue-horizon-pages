import { Lock } from "lucide-react";

const PortalLockedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center space-y-4 p-8">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Portal Locked</h1>
        <p className="text-muted-foreground max-w-md">
          Your portal access is currently locked. Please contact your administrator for assistance.
        </p>
      </div>
    </div>
  );
};

export default PortalLockedPage;
