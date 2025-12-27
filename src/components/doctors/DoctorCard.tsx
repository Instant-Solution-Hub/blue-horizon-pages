import { Doctor } from "@/hooks/useDoctors";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Stethoscope,
  Building2,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

interface DoctorCardProps {
  doctor: Doctor;
  onEdit: (doctor: Doctor) => void;
  onDelete: (id: string) => void;
}

const DoctorCard = ({ doctor, onEdit, onDelete }: DoctorCardProps) => {
  return (
    <Card className="hover-lift transition-all duration-200 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                {doctor.name}
              </CardTitle>
              <CardDescription className="text-sm">
                {doctor.specialization}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={doctor.isActive ? "default" : "secondary"}
              className={
                doctor.isActive
                  ? "bg-success/10 text-success hover:bg-success/20"
                  : ""
              }
            >
              {doctor.isActive ? "Active" : "Inactive"}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(doctor)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Doctor</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {doctor.name}? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(doctor.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        {doctor.hospital && (
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{doctor.hospital}</span>
          </div>
        )}
        {doctor.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{doctor.phone}</span>
          </div>
        )}
        {doctor.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{doctor.email}</span>
          </div>
        )}
        {(doctor.city || doctor.state) && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>
              {[doctor.city, doctor.state].filter(Boolean).join(", ")}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
