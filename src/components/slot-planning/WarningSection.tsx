import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CalendarClock } from "lucide-react";

interface WarningSectionProps {
  isFirstOfMonth: boolean;
}

export function WarningSection({ isFirstOfMonth }: WarningSectionProps) {
  if (isFirstOfMonth) {
    return (
      <Alert className="border-primary/50 bg-primary/10">
        <CalendarClock className="h-5 w-5 text-primary" />
        <AlertTitle className="text-primary font-semibold">Slot Planning Day</AlertTitle>
        <AlertDescription className="text-primary/80">
          Hey there, Kindly plan your slots for the upcoming month before 4pm today.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive" className="border-amber-500/50 bg-amber-500/10">
      <AlertTriangle className="h-5 w-5 text-amber-600" />
      <AlertTitle className="text-amber-700 font-semibold">Slot Update Notice</AlertTitle>
      <AlertDescription className="text-amber-600">
        Your monthly slot is constant throughout the month. To change, submit a request to your manager.
      </AlertDescription>
    </Alert>
  );
}
