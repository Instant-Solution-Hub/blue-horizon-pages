import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  Building2,
  MapPin,
  Phone,
  Stethoscope,
} from "lucide-react";
import {
  AssignedDoctor,
  CURRENT_FE,
  PrescriptionType,
  createRequest,
  getChangeCounts,
  getDoctors,
  getRequests,
  subscribe,
} from "@/lib/prescriptionStore";

const typeColor: Record<PrescriptionType, string> = {
  RP: "bg-emerald-100 text-emerald-700 border-emerald-200",
  OP: "bg-amber-100 text-amber-700 border-amber-200",
  NP: "bg-slate-100 text-slate-700 border-slate-200",
};

const AssignedDoctors = () => {
  const [tick, setTick] = useState(0);
  const [search, setSearch] = useState("");
  const [editDoctor, setEditDoctor] = useState<AssignedDoctor | null>(null);
  const [newType, setNewType] = useState<PrescriptionType>("RP");

  useEffect(() => subscribe(() => setTick((t) => t + 1)), []);

  const doctors = useMemo(
    () => getDoctors().filter((d) => d.fieldExecutiveId === CURRENT_FE.id),
    [tick]
  );
  const counts = useMemo(() => getChangeCounts(CURRENT_FE.id), [tick]);
  const pendingIds = useMemo(
    () =>
      new Set(
        getRequests()
          .filter((r) => r.fieldExecutiveId === CURRENT_FE.id && r.status === "PENDING")
          .map((r) => r.doctorId)
      ),
    [tick]
  );

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.hospital.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (d: AssignedDoctor) => {
    setEditDoctor(d);
    setNewType(d.prescriptionType);
  };

  const submit = () => {
    if (!editDoctor) return;
    if (newType === editDoctor.prescriptionType) {
      toast.error("Please select a different prescription type");
      return;
    }
    createRequest({
      doctorId: editDoctor.id,
      doctorName: editDoctor.name,
      fieldExecutiveId: CURRENT_FE.id,
      fieldExecutiveName: CURRENT_FE.name,
      currentType: editDoctor.prescriptionType,
      requestedType: newType,
    });
    toast.success("Change request sent to admin for approval");
    setEditDoctor(null);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  My Doctors
                </h1>
                <p className="text-sm text-muted-foreground">
                  Doctors assigned to you
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-emerald-50 border-emerald-200">
                <ArrowUp className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="text-xs text-emerald-700">Upgraded</p>
                  <p className="font-bold text-emerald-700 leading-none">{counts.up}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-rose-50 border-rose-200">
                <ArrowDown className="w-4 h-4 text-rose-600" />
                <div>
                  <p className="text-xs text-rose-700">Downgraded</p>
                  <p className="font-bold text-rose-700 leading-none">{counts.down}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <Input
              placeholder="Search by doctor or hospital..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((d) => {
              const pending = pendingIds.has(d.id);
              return (
                <Card key={d.id} className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{d.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5" /> {d.hospital}
                      </p>
                    </div>
                    <Badge className={typeColor[d.prescriptionType]} variant="outline">
                      {d.prescriptionType}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" /> {d.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" /> {d.contact}
                    </p>
                  </div>
                  <div className="pt-2 border-t flex items-center justify-between">
                    {pending ? (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Request Pending
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Prescription: {d.prescriptionType}
                      </span>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(d)}
                      disabled={pending}
                    >
                      Edit Prescription
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No doctors found
            </div>
          )}
        </main>
      </div>

      <Dialog open={!!editDoctor} onOpenChange={(o) => !o && setEditDoctor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Prescription Type</DialogTitle>
            <DialogDescription>
              A request will be sent to the admin. The change will only apply once
              approved.
            </DialogDescription>
          </DialogHeader>
          {editDoctor && (
            <div className="space-y-4 py-2">
              <div className="text-sm">
                <p className="font-medium">{editDoctor.name}</p>
                <p className="text-muted-foreground">{editDoctor.hospital}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Current:</span>
                <Badge className={typeColor[editDoctor.prescriptionType]} variant="outline">
                  {editDoctor.prescriptionType}
                </Badge>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New prescription type</label>
                <Select value={newType} onValueChange={(v) => setNewType(v as PrescriptionType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RP">RP — Regular Prescriber</SelectItem>
                    <SelectItem value="OP">OP — Occasional Prescriber</SelectItem>
                    <SelectItem value="NP">NP — Non Prescriber</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDoctor(null)}>
              Cancel
            </Button>
            <Button onClick={submit}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignedDoctors;
