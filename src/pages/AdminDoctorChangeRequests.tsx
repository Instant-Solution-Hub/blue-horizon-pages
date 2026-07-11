import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bell,
  ChevronLeft,
  UserCircle2,
} from "lucide-react";
import {
  PrescriptionType,
  getChangeCounts,
  getDoctors,
  getRequests,
  reviewRequest,
  subscribe,
} from "@/lib/prescriptionStore";
import { toast } from "sonner";
import { format } from "date-fns";

const typeColor: Record<PrescriptionType, string> = {
  RP: "bg-emerald-100 text-emerald-700 border-emerald-200",
  OP: "bg-amber-100 text-amber-700 border-amber-200",
  NP: "bg-slate-100 text-slate-700 border-slate-200",
};

const AdminDoctorChangeRequests = () => {
  const [tick, setTick] = useState(0);
  const [selectedFe, setSelectedFe] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => subscribe(() => setTick((t) => t + 1)), []);

  const fes = useMemo(() => {
    const map = new Map<string, string>();
    getDoctors().forEach((d) => map.set(d.fieldExecutiveId, d.fieldExecutiveName));
    getRequests().forEach((r) => map.set(r.fieldExecutiveId, r.fieldExecutiveName));
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [tick]);

  const pendingByFe = useMemo(() => {
    const map = new Map<string, number>();
    getRequests()
      .filter((r) => r.status === "PENDING")
      .forEach((r) => map.set(r.fieldExecutiveId, (map.get(r.fieldExecutiveId) ?? 0) + 1));
    return map;
  }, [tick]);

  const feRequests = useMemo(() => {
    if (!selectedFe) return [];
    return getRequests().filter((r) => r.fieldExecutiveId === selectedFe.id);
  }, [selectedFe, tick]);

  const handleReview = (id: string, approve: boolean) => {
    reviewRequest(id, approve);
    toast.success(approve ? "Request approved" : "Request rejected");
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Doctor Change Requests</h1>
          <p className="text-muted-foreground">
            Approve or reject prescription-type change requests raised by Field Executives
          </p>
        </div>

        {!selectedFe ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fes.map((fe) => {
              const counts = getChangeCounts(fe.id);
              const pending = pendingByFe.get(fe.id) ?? 0;
              return (
                <Card
                  key={fe.id}
                  className="p-5 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedFe(fe)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCircle2 className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{fe.name}</h3>
                        <p className="text-xs text-muted-foreground">Field Executive</p>
                      </div>
                    </div>
                    {pending > 0 && (
                      <Badge className="bg-rose-500 text-white gap-1">
                        <Bell className="w-3 h-3" /> {pending}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 border border-emerald-200">
                      <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-700">{counts.up}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-50 border border-rose-200">
                      <ArrowDown className="w-3.5 h-3.5 text-rose-600" />
                      <span className="text-sm font-semibold text-rose-700">{counts.down}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Button variant="outline" size="sm" onClick={() => setSelectedFe(null)}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
              <h2 className="text-lg font-semibold">{selectedFe.name}</h2>
            </div>

            {feRequests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No requests from this Field Executive
              </div>
            ) : (
              <div className="space-y-3">
                {feRequests.map((r) => (
                  <Card key={r.id} className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{r.doctorName}</h3>
                          <Badge
                            variant="outline"
                            className={
                              r.status === "PENDING"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : r.status === "APPROVED"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }
                          >
                            {r.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Badge className={typeColor[r.currentType]} variant="outline">
                            {r.currentType}
                          </Badge>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          <Badge className={typeColor[r.requestedType]} variant="outline">
                            {r.requestedType}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Requested {format(new Date(r.requestedAt), "PPp")}
                        </p>
                      </div>
                      {r.status === "PENDING" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReview(r.id, false)}
                          >
                            Reject
                          </Button>
                          <Button size="sm" onClick={() => handleReview(r.id, true)}>
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDoctorChangeRequests;
