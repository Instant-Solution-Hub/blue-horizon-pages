import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecordJoiningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JoiningFormData) => void;
}

export interface JoiningFormData {
  scheduledTime: string;
  joiningTime: string;
  notes: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  hospital: string;
}

// Mock data for doctors and hospitals
const mockDoctors = [
  { id: "1", name: "Dr. Sharma", hospital: "City Hospital", designation: "Cardiologist", category: "A+" },
  { id: "2", name: "Dr. Patel", hospital: "Metro Clinic", designation: "Neurologist", category: "A" },
  { id: "3", name: "Dr. Gupta", hospital: "Care Hospital", designation: "Orthopedic", category: "B" },
  { id: "4", name: "Dr. Singh", hospital: "Apollo Hospital", designation: "General Physician", category: "A+" },
  { id: "5", name: "Dr. Kumar", hospital: "Max Hospital", designation: "Dermatologist", category: "A" },
];

const mockHospitals = [
  "City Hospital",
  "Metro Clinic",
  "Care Hospital",
  "Apollo Hospital",
  "Max Hospital",
  "Fortis Hospital",
  "AIIMS",
];

const RecordJoiningModal = ({ isOpen, onClose, onSubmit }: RecordJoiningModalProps) => {
  const [scheduledTime, setScheduledTime] = useState("");
  const [joiningTime, setJoiningTime] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<typeof mockDoctors[0] | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [hospital, setHospital] = useState("");
  const [doctorOpen, setDoctorOpen] = useState(false);
  const [hospitalOpen, setHospitalOpen] = useState(false);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [hospitalSearch, setHospitalSearch] = useState("");

  const filteredDoctors = mockDoctors.filter((doc) =>
    doc.name.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  const filteredHospitals = mockHospitals.filter((h) =>
    h.toLowerCase().includes(hospitalSearch.toLowerCase())
  );

  const isFormValid = scheduledTime && joiningTime && selectedDoctor && date && hospital;

  const handleSubmit = () => {
    if (!isFormValid || !selectedDoctor || !date) return;

    onSubmit({
      scheduledTime,
      joiningTime,
      notes,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      date,
      hospital,
    });

    // Reset form
    setScheduledTime("");
    setJoiningTime("");
    setNotes("");
    setSelectedDoctor(null);
    setDate(undefined);
    setHospital("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record Manager Joining</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Date */}
          <div className="space-y-2">
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Doctor Selection */}
          <div className="space-y-2">
            <Label>Doctor *</Label>
            <Popover open={doctorOpen} onOpenChange={setDoctorOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={doctorOpen}
                  className="w-full justify-between"
                >
                  {selectedDoctor ? selectedDoctor.name : "Select doctor..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search doctor..."
                    value={doctorSearch}
                    onValueChange={setDoctorSearch}
                  />
                  <CommandList>
                    <CommandEmpty>No doctor found.</CommandEmpty>
                    <CommandGroup>
                      {filteredDoctors.map((doctor) => (
                        <CommandItem
                          key={doctor.id}
                          value={doctor.name}
                          onSelect={() => {
                            setSelectedDoctor(doctor);
                            setHospital(doctor.hospital);
                            setDoctorOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedDoctor?.id === doctor.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div>
                            <p className="font-medium">{doctor.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doctor.designation} • {doctor.category} • {doctor.hospital}
                            </p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Hospital Selection */}
          <div className="space-y-2">
            <Label>Hospital *</Label>
            <Popover open={hospitalOpen} onOpenChange={setHospitalOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={hospitalOpen}
                  className="w-full justify-between"
                >
                  {hospital || "Select hospital..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search hospital..."
                    value={hospitalSearch}
                    onValueChange={setHospitalSearch}
                  />
                  <CommandList>
                    <CommandEmpty>No hospital found.</CommandEmpty>
                    <CommandGroup>
                      {filteredHospitals.map((h) => (
                        <CommandItem
                          key={h}
                          value={h}
                          onSelect={() => {
                            setHospital(h);
                            setHospitalOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              hospital === h ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {h}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Scheduled Time */}
          <div className="space-y-2">
            <Label htmlFor="scheduledTime">Scheduled Time *</Label>
            <Input
              id="scheduledTime"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </div>

          {/* Joining Time */}
          <div className="space-y-2">
            <Label htmlFor="joiningTime">Joining Time *</Label>
            <Input
              id="joiningTime"
              type="time"
              value={joiningTime}
              onChange={(e) => setJoiningTime(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="w-full"
          >
            Record Joining
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecordJoiningModal;
