import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Camera, ExternalLink } from "lucide-react";

export interface AdminSlotVisit {
  id: number;
  type: "doctor" | "pharmacist";
  name: string;
  category?: string;
  practiceType?: string;
  designation?: string;
  hospitalName: string;
  visitTrack: string;
  // New fields for location data
  latitude?: string;
  longitude?: string;
  photoProofUrl?: string;
  locationMethod?: "gps" | "photo";
}

interface AdminSlotVisitListProps {
  doctorVisits: AdminSlotVisit[];
  pharmacistVisits: AdminSlotVisit[];
}

const categoryColors: Record<string, string> = {
  A_PLUS: "bg-emerald-100 text-emerald-800 border-emerald-300",
  A: "bg-blue-100 text-blue-800 border-blue-300",
  B: "bg-amber-100 text-amber-800 border-amber-300",
};

const practiceTypeLabels: Record<string, string> = {
  RP: "RP",
  OP: "OP",
  NP: "NP",
};

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Photo Viewer Dialog Component
function PhotoViewerDialog({ 
  isOpen, 
  onClose, 
  photoUrl, 
  visitName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  photoUrl: string; 
  visitName: string;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Visit Photo Proof - {visitName}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center p-4">
          <img 
            src={baseUrl+photoUrl} 
            alt={`Proof for ${visitName}`}
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
          />
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Location Display Component
function LocationDisplay({ 
  latitude, 
  longitude, 
  photoProofUrl, 
  locationMethod,
  visitName 
}: { 
  latitude?: string; 
  longitude?: string; 
  photoProofUrl?: string; 
  locationMethod?: string;
  visitName: string;
}) {
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  if (locationMethod === "gps" && latitude && longitude) {
    return (
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-mono">
          {parseFloat(latitude).toFixed(6)}, {parseFloat(longitude).toFixed(6)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2"
          onClick={() => {
            window.open(`https://maps.google.com/?q=${latitude},${longitude}`, '_blank');
          }}
        >
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  if (locationMethod === "photo" && photoProofUrl) {
    return (
      <div className="flex items-center gap-2">
        <Camera className="h-4 w-4 text-muted-foreground" />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPhotoOpen(true)}
        >
          View Photo
        </Button>
        <PhotoViewerDialog
          isOpen={isPhotoOpen}
          onClose={() => setIsPhotoOpen(false)}
          photoUrl={photoProofUrl}
          visitName={visitName}
        />
      </div>
    );
  }

  return (
    <span className="text-sm text-muted-foreground">Not captured</span>
  );
}

function PharmacistVisitTable({
  title,
  visits,
}: {
  title: string;
  visits: any[];
}) {
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; name: string } | null>(null);

  if (visits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No visits for this day.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {title} ({visits.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Field Executive</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Hospital</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Visit Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visits.map((visit) => (
              <TableRow key={visit.id}>
                <TableCell className="font-medium">{visit.pharmacyName}</TableCell>
                <TableCell>{visit.contactPerson || "-"}</TableCell>
                <TableCell>{visit.fieldExecutiveName || "-"}</TableCell>
                <TableCell>{visit.contactNumber || "-"}</TableCell>
                <TableCell>{visit.hospitalName || "-"}</TableCell>
                <TableCell>
                  <LocationDisplay
                    latitude={visit.latitude}
                    longitude={visit.longitude}
                    photoProofUrl={visit.photoProofUrl}
                    locationMethod={visit.locationMethod}
                    visitName={visit.pharmacyName}
                  />
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{visit.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function DoctorVisitTable({
  title,
  visits,
}: {
  title: string;
  visits: any[];
}) {
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; name: string } | null>(null);

  if (visits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No visits for this day.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {title} ({visits.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Prescription Type</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Hospital</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Visit Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visits.map((visit) => (
              <TableRow key={visit.id}>
                <TableCell className="font-medium">{visit.doctorName}</TableCell>
                <TableCell>
                  {visit.category ? (
                    <Badge
                      variant="outline"
                      className={categoryColors[visit.category] || ""}
                    >
                      {visit.category === "A_PLUS" ? "A+" : visit.category}
                    </Badge>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {visit.practiceType ? (
                    <span className="text-sm text-muted-foreground">
                      {practiceTypeLabels[visit.practiceType] ||
                        visit.practiceType}
                    </span>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{visit.designation || "-"}</TableCell>
                <TableCell>{visit.hospital}</TableCell>
                <TableCell>
                  <LocationDisplay
                    latitude={visit.latitude}
                    longitude={visit.longitude}
                    photoProofUrl={visit.photoProofUrl}
                    locationMethod={visit.locationMethod}
                    visitName={visit.doctorName}
                  />
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{visit.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function AdminSlotVisitList({
  doctorVisits,
  pharmacistVisits,
}: AdminSlotVisitListProps) {
  return (
    <div className="space-y-4">
      <DoctorVisitTable title="Doctor Visits" visits={doctorVisits} />
      <PharmacistVisitTable title="Pharmacist Visits" visits={pharmacistVisits} />
    </div>
  );
}