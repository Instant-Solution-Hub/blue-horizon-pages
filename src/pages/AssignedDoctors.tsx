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
import type { PracticeType } from "@/hooks/useDoctors";
import {
  fetchDoctorChangeRequests,
  fetchDoctorChangeStats,
  fetchDoctorsByFE,
  createDoctorChangeRequest,
  DoctorChangeRequest,
} from "@/services/DoctorService";

type AssignedDoctor = {
  id: string;
  name: string;
  category: string;
  practiceType: PracticeType;
  designation: string | null;
  hospitalName: string;
  location: string | null;
  contactNumber: string | null;
  doctorCode: string | null;
  latitude: string | null;
  longitude: string | null;
  active: boolean;
};

const typeColor: Record<PracticeType, string> = {
  RP: "bg-emerald-100 text-emerald-700 border-emerald-200",
  OP: "bg-amber-100 text-amber-700 border-amber-200",
  NP: "bg-slate-100 text-slate-700 border-slate-200",
};
const AssignedDoctors = () => {
  const [doctors, setDoctors] = useState<AssignedDoctor[]>([]);
  const [requests, setRequests] = useState<DoctorChangeRequest[]>([]);
  const [stats, setStats] = useState<{ upgraded: number; downgraded: number }>({
    upgraded: 0,
    downgraded: 0,
  });
  const [search, setSearch] = useState("");
  const [editDoctor, setEditDoctor] = useState<AssignedDoctor | null>(null);
  const [newType, setNewType] = useState<PracticeType>("RP");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadKey, setLoadKey] = useState(0);
  const fieldExecutiveId = Number(sessionStorage.getItem("feID") || 0);

  useEffect(() => {
    if (!fieldExecutiveId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [doctorList, changeRequests, changeStats] = await Promise.all([
          fetchDoctorsByFE(fieldExecutiveId),
          fetchDoctorChangeRequests(fieldExecutiveId),
          fetchDoctorChangeStats(fieldExecutiveId),
        ]);

        setDoctors(
          doctorList.map((doctor: any) => ({
            ...doctor,
            id: String(doctor.id),
            practiceType: doctor.practiceType as PracticeType,
            hospitalName: doctor.hospitalName,
            contactNumber: doctor.contactNumber,
          }))
        );
        setRequests(
          changeRequests.map((request) => ({
            ...request,
            id: String(request.id),
            doctorId: String(request.doctorId),
            fieldExecutiveId: String(request.fieldExecutiveId),
            currentPracticeType: request.currentPracticeType as PracticeType,
            requestedPracticeType: request.requestedPracticeType as PracticeType,
            requestedAt: request.requestedAt,
            reviewedAt: request.reviewedAt,
          }))
        );
        setStats({
          upgraded: changeStats.upgraded,
          downgraded: changeStats.downgraded,
        });
      } catch (err) {
        console.error("Failed to load assigned doctors data", err);
        toast.error("Unable to load doctor assignments right now.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fieldExecutiveId, loadKey]);

  const doctorsFiltered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.hospitalName.toLowerCase().includes(search.toLowerCase())
  );

  const pendingIds = useMemo(
    () =>
      new Set(
        requests
          .filter((r) => r.status === "PENDING")
          .map((r) => r.doctorId)
      ),
    [requests]
  );
  const openEdit = (d: AssignedDoctor) => {
    setEditDoctor(d);
    setNewType(d.practiceType);
  };

  const submit = async () => {
    if (!editDoctor || !fieldExecutiveId) return;
    if (newType === editDoctor.practiceType) {
      toast.error("Please select a different prescription type");
      return;
    }

    setSubmitting(true);
    try {
      await createDoctorChangeRequest(
        fieldExecutiveId,
        Number(editDoctor.id),
        newType
      );
      toast.success("Change request sent to admin for approval");
      setEditDoctor(null);
      setLoadKey((key) => key + 1);
    } catch (err) {
      console.error("Failed to create doctor change request", err);
      toast.error("Unable to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
                  <p className="font-bold text-emerald-700 leading-none">{stats.upgraded}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-rose-50 border-rose-200">
                <ArrowDown className="w-4 h-4 text-rose-600" />
                <div>
                  <p className="text-xs text-rose-700">Downgraded</p>
                  <p className="font-bold text-rose-700 leading-none">{stats.downgraded}</p>
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
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading doctors...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctorsFiltered.map((d) => {
                  const pending = pendingIds.has(d.id);
                  return (
                    <Card key={d.id} className="p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground">{d.name}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3.5 h-3.5" /> {d.hospitalName}
                          </p>
                        </div>
                        <Badge className={typeColor[d.practiceType]} variant="outline">
                          {d.practiceType}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5" /> {d.location}
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5" /> {d.contactNumber}
                        </p>
                      </div>
                      <div className="pt-2 border-t flex items-center justify-between">
                        {pending ? (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            Request Pending
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Prescription: {d.practiceType}
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
              {doctorsFiltered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No doctors found
                </div>
              )}
            </>
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
                <p className="text-muted-foreground">{editDoctor.hospitalName}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Current:</span>
                <Badge className={typeColor[editDoctor.practiceType]} variant="outline">
                  {editDoctor.practiceType}
                </Badge>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New prescription type</label>
                <Select value={newType} onValueChange={(v) => setNewType(v as PracticeType)}>
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