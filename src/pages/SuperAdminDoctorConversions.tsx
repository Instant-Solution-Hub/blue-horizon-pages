import { useState, useEffect } from "react";
import SuperAdminSidebar from "@/components/super-admin-dashboard/SuperAdminSidebar";
import DoctorConversionList from "@/components/admin-doctor-conversions/DoctorConversionList";
import { fetchDoctorConversions, fetchDoctorConversionsForTheMonth, DoctorConversion } from "@/services/DoctorConversion";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function SuperAdminDoctorConversions() {
  const { toast } = useToast();
  const [conversions, setConversions] = useState<DoctorConversion[]>([]);
  const [loading, setLoading] = useState(false);
  const [feSearch, setFeSearch] = useState("");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  const loadConversions = async (fDate?: Date, tDate?: Date) => {
    try {
      setLoading(true);
      let conversionsData;
      if (fDate && tDate) {
        conversionsData = await fetchDoctorConversions(
          format(fDate, "yyyy-MM-dd"),
          format(tDate, "yyyy-MM-dd")
        );
      } else {
        conversionsData = await fetchDoctorConversionsForTheMonth();
      }
      const sortedData = Array.isArray(conversionsData)
        ? [...conversionsData].sort((a, b) => (a.fieldExecutiveName || "").localeCompare(b.fieldExecutiveName || "", undefined, { sensitivity: "base" }))
        : [];
      setConversions(sortedData);
    } catch (err) {
      console.error("Failed to load conversions", err);
      toast({ title: "Error", description: "Failed to load doctor conversions data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load current month initially
    loadConversions();
  }, []);

  // Reload when both dates are selected
  useEffect(() => {
    if (fromDate && toDate) {
      loadConversions(fromDate, toDate);
    }
  }, [fromDate, toDate]);

  const filteredConversions = conversions.filter((c) => (c.fieldExecutiveName || "").toLowerCase().includes(feSearch.toLowerCase()));

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-display font-semibold text-foreground">Doctor Conversions</h1>
              <p className="text-muted-foreground">View conversions added by Admin (read-only)</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="space-y-1">
                <Label className="text-sm">From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-[180px] justify-start text-left font-normal", !fromDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? format(fromDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1">
                <Label className="text-sm">To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-[180px] justify-start text-left font-normal", !toDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? format(toDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                  </PopoverContent>
                </Popover>
              </div>

              {(fromDate || toDate) && (
                <Button variant="ghost" className="self-end" onClick={() => { setFromDate(undefined); setToDate(undefined); loadConversions(); }}>
                  Clear
                </Button>
              )}

              <div className="ml-auto w-full max-w-sm">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search by FE name..." value={feSearch} onChange={(e) => setFeSearch(e.target.value)} className="pl-9" />
                </div>
              </div>
            </div>

            <Card>
              <CardContent>
                <DoctorConversionList conversions={filteredConversions} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
