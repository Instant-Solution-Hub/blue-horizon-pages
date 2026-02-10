import { useState, useMemo, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Send } from "lucide-react";
import { WeekDaySelector } from "../slot-planning/WeekDaySelector";

interface Visit {
    id: number;
    name: string;
    type: "doctor";
}

interface RequestUpdateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    doctorVisits: Visit[];
    onSubmit: (data: {
        visitType: string;
        visitId: number;
        selectedWeek: number;
        selectedDay: number;
        notes: string;
    }) => void;
}

export function ManagerRequestUpdateModal({
    open,
    onOpenChange,
    doctorVisits,
    onSubmit,
}: RequestUpdateModalProps) {
    const [visitType, setVisitType] = useState<string>("");
    const [selectedVisitId, setSelectedVisitId] = useState<number | null>(null);
    const [notes, setNotes] = useState("");
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [selectedDay, setSelectedDay] = useState(1);
    const { currentWeek, currentDay } = getCurrentWeekAndDay();

    const filteredVisits =doctorVisits;

    useEffect(() => {
        console.log("Filtering visits for type:", doctorVisits, visitType);
    }, []);

    function getCurrentWeekAndDay() {
        const today = new Date();

        // Day of week: Mon = 1, Sun = 7
        const jsDay = today.getDay(); // 0 = Sun
        const currentDay = jsDay === 0 ? 7 : jsDay;

        // Week of month (1–4/5)
        const firstDayOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        ).getDay();

        const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
        const currentWeek = Math.ceil((today.getDate() + offset) / 7);

        return { currentWeek, currentDay };
    }

    const resetForm = () => {
        setVisitType("");
        setSelectedVisitId(null);
        setNotes("");
    };

    const handleSubmit = () => {
        if (!selectedVisitId) return;

        onSubmit({
            visitType,
            visitId: selectedVisitId,
            selectedWeek: selectedWeek,
            selectedDay: selectedDay,
            notes,
        });

        resetForm();
        onOpenChange(false);
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            resetForm();
        }
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Request Slot Update</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-2">
                    {/* Visit Type */}
                    {/* <div className="space-y-2">
                        <Label>Visit Type</Label>
                        <Select
                            value={visitType}
                            onValueChange={(value) => {
                                setVisitType(value);
                                setSelectedVisitId(null);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select visit type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="doctor">Doctor Visit</SelectItem>
                                <SelectItem value="pharmacist">Pharmacist Visit</SelectItem>
                            </SelectContent>
                        </Select>
                    </div> */}

                    {/* Visit Selection */}
                    {(
                        <div className="space-y-2">
                            <Label>Select Visit to Update</Label>

                            <RadioGroup
                                value={selectedVisitId?.toString()}
                                onValueChange={(value) =>
                                    setSelectedVisitId(Number(value))
                                }
                                className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2"
                            >
                                {filteredVisits.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-2">
                                        No {visitType} visits scheduled for today
                                    </p>
                                ) : (
                                    filteredVisits.map((visit) => (
                                        <div
                                            key={visit.id}
                                            className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted/50"
                                        >
                                            <RadioGroupItem
                                                value={visit.id.toString()}
                                                id={`visit-${visit.id}`}
                                            />
                                            <label
                                                htmlFor={`visit-${visit.id}`}
                                                className="text-sm font-medium cursor-pointer flex-1"
                                            >
                                                {visit.name}
                                            </label>
                                        </div>
                                    ))
                                )}
                            </RadioGroup>
                        </div>
                    )}


                    <WeekDaySelector
                        selectedWeek={selectedWeek}
                        selectedDay={selectedDay}
                        currentWeek={currentWeek}
                        currentDay={currentDay}
                        isPastDisabled={false}
                        onWeekChange={setSelectedWeek}
                        onDayChange={setSelectedDay}
                    />

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Provide reason for update request..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>

                <DialogFooter className="bottom-0 bg-background pt-4">
                    <Button variant="outline" onClick={() => handleOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={ !selectedVisitId || !notes.trim()}
                    >
                        <Send className="h-4 w-4 mr-2" />
                        Request
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
