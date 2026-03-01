"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { MonthlyTargetProgress } from "@/components/slot-planning/MonthlyTargetProgress";
import { WarningSection } from "@/components/slot-planning/WarningSection";
import { WeekDaySelector } from "@/components/slot-planning/WeekDaySelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, UserPlus, Send, CalendarCheck, Phone, Mail, MapPin, Hash, User, Calendar, Clock, Building, Stethoscope } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchPriorityFieldExecutives,
  assignManagerToFieldExecutive,
  unAssignManagerToFieldExecutive
} from "@/services/ManagerService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ManagerRequestUpdateModal } from "@/components/manager-slot-planning/ManagerRequestUpdateModal";
import { slotChangeRequest } from "@/services/SlotRequestService";
import { fetchAllVisitsByWeekDay } from "@/services/ManagerVisitService";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import ManagerHeader from "@/components/manager-dashboard/ManagerHeader";

/* ---------------- TYPES ---------------- */

interface FieldExecutive {
  id: number;
  name: string;
  email: string;
  phone: string;
  employeeCode: string;
  territory: string;
  region: string;
  managerId: number;
}

interface ManagerVisit {
  id: number;
  fieldExecutiveId: number;
  fieldExecutiveName: string;
  doctorName: string;
  hospitalName: string;
  visitTime: string;
  visitType: string; // "A+", "A", etc.
  category: string;
  location: string;
  status: string;
}

/* ---------------- PAGE ---------------- */

export default function ManagerSlotPlanning() {
  const { toast } = useToast();
  const { currentWeek, currentDay } = getCurrentWeekAndDay();

  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedFE, setSelectedFE] = useState<number | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [managerVisits, setManagerVisits] = useState<any[]>([]);

  const [fieldExecutives, setFieldExecutives] = useState<FieldExecutive[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isUnAssigning, setIsUnAssigning] = useState(false);

  const [assignedFEs, setAssignedFEs] = useState<number[]>([]); // Track assigned FEs locally

  const userId = Number(sessionStorage.getItem("userID"));
  const managerName = sessionStorage.getItem("userName") || "Manager";

  const today = new Date();
  const currentMonthName = today.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const isFirstOfMonth = today.getDate() === 2;
  // const isFirstOfMonth = true; // For testing

  useEffect(() => {
    if (selectedWeek && selectedDay) {
      if (isFirstOfMonth) {
        // First of month: Show FE assignment page
        fetchAllocatedFEsData();
        fetchManagerVisitsByWeekDay();

      } else {
        // After first of month: Show manager's assigned visits
        fetchManagerVisitsByWeekDay();
      }
    }
  }, [selectedWeek, selectedDay, isFirstOfMonth]);

  /* ---------------- DATE HELPERS ---------------- */

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

  /* ---------------- API CALLS ---------------- */

  const fetchAllocatedFEsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchPriorityFieldExecutives(
        userId,
        selectedWeek,
        selectedDay
      );
      setFieldExecutives(response);
      console.log("fetched allocated fes", response);
      // setAssignedFEs(prev => [...prev, response]);

      // Auto-select first FE if none selected
      if (response.length > 0 && !selectedFE) {
        setSelectedFE(response[0].id);
      }
    } catch (error) {
      console.error("Error fetching field executives:", error);
      toast({
        title: "Error",
        description: "Failed to load field executives",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchManagerVisitsByWeekDay = async () => {
  setIsLoading(true);
  try {
    const response = await fetchAllVisitsByWeekDay(
      userId,
      selectedWeek,
      selectedDay
    );

    const visits = response.data;

    setManagerVisits(visits);

    const uniqueFeIds:any = Array.from(
      new Set(visits.map(i => i.feId))
    );

    setAssignedFEs(uniqueFeIds);

    console.log("unique FEs", uniqueFeIds);
  } catch (error) {
    console.error("Error fetching manager visits:", error);
    toast({
      title: "Error",
      description: "Failed to load your visits",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};


  /* ---------------- HANDLERS ---------------- */

  const handleAssignToFieldExecutive = async (feId: number, feName: string) => {
    setIsAssigning(true);
    try {
      let obj = {
        "managerId": userId,
        "fieldExecutiveId": feId,
        "weekNumber": selectedWeek,
        "dayOfWeek": selectedDay
      }
      const response = await assignManagerToFieldExecutive(obj);

      if (response.success) {
        fetchManagerVisitsByWeekDay();

        // Update local state to track assignment
        // setAssignedFEs(prev => [...prev, feId]);

        toast({
          title: "Successfully Assigned",
          description: `You have been assigned to ${feName}'s A+ and A visits for Week ${selectedWeek}, Day ${selectedDay}.`,
        });

        // Refresh the visits list if not first of month
        if (!isFirstOfMonth) {
          fetchManagerVisitsByWeekDay();
        }
      }
    } catch (error: any) {
      console.error("Error assigning to field executive:", error);
      toast({
        title: "Assignment Failed",
        description: error.response?.data?.message || "Failed to assign to field executive",
        variant: "destructive",
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnAssignToFieldExecutive = async (feId: number, feName: string) => {
    setIsUnAssigning(true);
    try {
      let obj = {
        "managerId": userId,
        "fieldExecutiveId": feId,
        "weekNumber": selectedWeek,
        "dayOfWeek": selectedDay
      }
      const response = await unAssignManagerToFieldExecutive(obj);

      if (response.success) {
        fetchManagerVisitsByWeekDay();

        // Update local state to track assignment
        // setAssignedFEs(prev => [...prev, feId]);

        toast({
          title: "Successfully Assigned",
          description: `You have been assigned to ${feName}'s A+ and A visits for Week ${selectedWeek}, Day ${selectedDay}.`,
        });

        // Refresh the visits list if not first of month
        if (!isFirstOfMonth) {
          fetchManagerVisitsByWeekDay();
        }
      }
    } catch (error: any) {
      console.error("Error assigning to field executive:", error);
      toast({
        title: "Assignment Failed",
        description: error.response?.data?.message || "Failed to assign to field executive",
        variant: "destructive",
      });
    } finally {
      setIsUnAssigning(false);
    }
  };

  const handleRequestUpdate = async (data: {
    visitType: string;
    visitId: number;
    selectedWeek: number;
    selectedDay: number;
    notes: string;
  }) => {
    console.log("Requesting update with data: ", data);
    let obj = {
      // "visitId": data.visitId,
      "userId": parseInt(sessionStorage.getItem("feID") || "0"),
      "managerVisitId": data.visitId,
      "requestedWeekNumber": data.selectedWeek,
      "requestedDayOfWeek": data.selectedDay,
      "reason": data.notes,
      "userType": "manager"
    }
    try {
      const response = await slotChangeRequest(obj);
      toast({
        title: "Request Sent",
        description: `Your slot update request for the selected ${data.visitType} visit has been sent to your admin for approval.`,
      });
    } catch (error) {
      toast({
        title: "Request Failed",
        description: `Your slot update request for the selected ${data.visitType} visit could not be sent.`,
      });
    }
  };

  /* ---------------- UI COMPONENTS ---------------- */

  const FieldExecutiveCard = ({ fe }: { fe: FieldExecutive }) => {
    const isAssigned = assignedFEs.includes(fe.id);
    const isAssignedToMe = isAssigned; // Since we're only tracking our own assignments

    return (
      <Card className={`relative overflow-hidden ${isAssignedToMe ? 'border-green-500' : ''}`}>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-5">
            {/* Header with FE info */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-xl">{fe.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    <Hash className="h-3 w-3 mr-1" />
                    {fe.employeeCode}
                  </Badge>
                  {isAssignedToMe && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                      Assigned to You
                    </Badge>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium">Week {selectedWeek}, Day {selectedDay}</p>
                <p className="text-xs text-muted-foreground">ID: {fe.id}</p>
              </div>
            </div>

            {/* FE Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{fe.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{fe.phone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPin className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Territory & Region</p>
                    <p className="text-sm font-medium">{fe.territory}, {fe.region}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <UserPlus className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Reporting Manager ID</p>
                    <p className="text-sm font-medium">{fe.managerId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Info */}
            <div className="border-t pt-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {isAssignedToMe
                      ? "You are assigned to this FE's A+ and A visits"
                      : "Available for assignment to A+ and A visits"
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Assignment applies to Week {selectedWeek}, Day {selectedDay}
                  </p>
                </div>

                {/* Assign Button */}
                {!isAssigned ? (
                  <Button
                    onClick={() => handleAssignToFieldExecutive(fe.id, fe.name)}
                    disabled={isAssigning}
                    className="min-w-[140px]"
                  >
                    {isAssigning ? (
                      <>
                        <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign Visits
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleUnAssignToFieldExecutive(fe.id, fe.name)}
                    disabled={isUnAssigning}
                    className="min-w-[140px]"
                  >
                    {isUnAssigning ? (
                      <>
                        <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        un-assigning...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Un-assign Visits
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ManagerVisitCard = ({ visit }: { visit: any }) => {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{visit.doctor.doctorName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    className={`
                      ${visit.doctor.category === 'A+' ? 'bg-red-100 text-red-800 hover:bg-red-100' :
                        visit.doctor.category === 'A' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100' :
                          'bg-blue-100 text-blue-800 hover:bg-blue-100'}
                    `}
                  >
                    {visit.doctor.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {visit.visitType}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Week {selectedWeek}, Day {selectedDay}</p>
                <p className="text-xs text-muted-foreground">Visit ID: {visit.visitId}</p>
              </div>
            </div>

            {/* Visit Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Hospital</p>
                    <p className="text-sm font-medium">{visit.doctor.hospitalName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Visit Date</p>
                    <p className="text-sm font-medium">{visit.visitDate}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <User className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Field Executive</p>
                    <p className="text-sm font-medium">{visit.feName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <User className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Doctor</p>
                    <p className="text-sm font-medium">{visit.doctor.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="border-t pt-4 flex justify-between items-center">
              <div>
                <Badge
                  variant={visit.status === 'Confirmed' ? 'default' : 'secondary'}
                  className={
                    visit.status === 'Confirmed' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                      visit.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                        'bg-gray-100 text-gray-800 hover:bg-gray-100'
                  }
                >
                  {visit.status}
                </Badge>
              </div>
              {/* <Button variant="outline" size="sm">
                <Stethoscope className="h-4 w-4 mr-2" />
                View Details
              </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  /* ---------------- UI ---------------- */

  const selectedFieldExecutive = fieldExecutives.find(fe => fe.id === selectedFE);

  return (
    <div className="h-screen bg-background flex w-full overflow-hidden">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ManagerHeader />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold">Manager Slot Planning</h1>
              <p className="text-muted-foreground">
                {currentMonthName} • {isFirstOfMonth ? "Assign to Field Executive Visits" : "Your Assigned Visits"}
              </p>
            </div>

            {!isFirstOfMonth && <MonthlyTargetProgress />}
            <WarningSection isFirstOfMonth={isFirstOfMonth} />

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {isFirstOfMonth
                    ? "Assign to Field Executive Visits"
                    : "Your Assigned Visits"
                  }
                </CardTitle>

                {!isFirstOfMonth && (
                  <Button
                    variant="outline"
                    onClick={() => setIsRequestModalOpen(true)}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Request Changes
                  </Button>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Week/Day Selector */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Select Visit Schedule</h3>
                  <WeekDaySelector
                    selectedWeek={selectedWeek}
                    selectedDay={selectedDay}
                    currentWeek={currentWeek}
                    currentDay={currentDay}
                    currentMonth={new Date().getMonth()+1}
                    isPastDisabled={false}
                    onWeekChange={setSelectedWeek}
                    onDayChange={setSelectedDay}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {isFirstOfMonth
                      ? `Select field executives for Week ${selectedWeek}, Day ${selectedDay}`
                      : `Viewing your visits for Week ${selectedWeek}, Day ${selectedDay}`
                    }
                  </p>
                </div>

                {/* Slot Planning Day Warning */}
                {isFirstOfMonth && selectedWeek === 1 && selectedDay === 2 ? (
                  <Alert variant="destructive" className="border-amber-500/50 bg-amber-500/10">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <AlertTitle className="text-amber-700 font-semibold">
                      Slot Planning Day
                    </AlertTitle>
                    <AlertDescription className="text-amber-600">
                      Today is slot planning day. You can view but cannot assign to visits scheduled for Week 1, Day 2.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-6">
                    {/* ========== FIRST OF MONTH: FE ASSIGNMENT PAGE ========== */}
                    {isFirstOfMonth ? (
                      <>
                        {/* Field Executive Selector */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Select Field Executive</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={fetchAllocatedFEsData}
                              disabled={isLoading}
                            >
                              {isLoading ? "Refreshing..." : "Refresh List"}
                            </Button>
                          </div>

                          <Select
                            value={selectedFE?.toString() || ""}
                            onValueChange={(value) => setSelectedFE(parseInt(value))}
                            disabled={isLoading || fieldExecutives.length === 0}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder={
                                isLoading ? "Loading field executives..." :
                                  fieldExecutives.length === 0 ? "No field executives available" :
                                    "Select a field executive"
                              } />
                            </SelectTrigger>
                            <SelectContent>
                              {isLoading ? (
                                <div className="p-2 space-y-1">
                                  <Skeleton className="h-6 w-full" />
                                  <Skeleton className="h-6 w-full" />
                                </div>
                              ) : fieldExecutives.length === 0 ? (
                                <div className="p-2 text-sm text-muted-foreground text-center">
                                  No field executives allocated for Week {selectedWeek}, Day {selectedDay}
                                </div>
                              ) : (
                                fieldExecutives.map((fe) => (
                                  <SelectItem key={fe.id} value={fe.id.toString()}>
                                    <div className="flex items-center justify-between w-full">
                                      <div className="flex flex-col">
                                        <span className="font-medium">{fe.name}</span>
                                        <span className="text-xs text-muted-foreground">
                                          {fe.employeeCode} • {fe.territory}
                                        </span>
                                      </div>
                                      {assignedFEs.includes(fe.id) && (
                                        <Badge
                                          variant="outline"
                                          className="bg-green-100 text-green-800 border-green-300 text-xs"
                                        >
                                          Assigned
                                        </Badge>
                                      )}
                                    </div>
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Assignment Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg border">
                            <p className="text-sm text-blue-700 font-medium">Total Field Executives</p>
                            <p className="text-2xl font-bold">{fieldExecutives.length}</p>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg border">
                            <p className="text-sm text-green-700 font-medium">Assigned by You</p>
                            <p className="text-2xl font-bold">
                              {assignedFEs.length}
                            </p>
                          </div>
                          <div className="bg-purple-50 p-4 rounded-lg border">
                            <p className="text-sm text-purple-700 font-medium">Remaining Available</p>
                            <p className="text-2xl font-bold">
                              {fieldExecutives.length - assignedFEs.length}
                            </p>
                          </div>
                        </div>

                        {/* Selected Field Executive Details */}
                        {isLoading ? (
                          <div className="space-y-4">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-64 w-full" />
                          </div>
                        ) : selectedFE ? (
                          selectedFieldExecutive ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">
                                  Field Executive Details
                                </h3>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">
                                    ID: {selectedFieldExecutive.id}
                                  </Badge>
                                  {assignedFEs.includes(selectedFieldExecutive.id) && (
                                    <Badge className="bg-green-100 text-green-800">
                                      Assigned to You
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <FieldExecutiveCard fe={selectedFieldExecutive} />

                              {/* Assignment Explanation */}
                              {!assignedFEs.includes(selectedFieldExecutive.id) && (
                                <Alert className="bg-blue-50 border-blue-200">
                                  <UserPlus className="h-4 w-4 text-blue-600" />
                                  <AlertTitle className="text-blue-800">Assignment Information</AlertTitle>
                                  <AlertDescription className="text-blue-700">
                                    By clicking "Assign to FE", you will be assigned to all A+ and A category visits
                                    for {selectedFieldExecutive.name} on Week {selectedWeek}, Day {selectedDay}.
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          ) : (
                            <Alert>
                              <AlertTitle>Field Executive Not Found</AlertTitle>
                              {/* <AlertDescription>
                                The selected field executive is no longer available. Please select another one.
                              </AlertDescription> */}
                            </Alert>
                          )
                        ) : (
                          <Alert>
                            <AlertTitle>No Field Executive Selected</AlertTitle>
                            <AlertDescription>
                              Please select a field executive from the dropdown to view details and assign yourself.
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* All Field Executives Quick View */}
                        {fieldExecutives.length > 1 && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-lg">
                                All Field Executives ({fieldExecutives.length})
                              </h3>
                              <span className="text-sm text-muted-foreground">
                                Click to select
                              </span>
                            </div>
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                              {fieldExecutives
                                .filter(fe => fe.id !== selectedFE) // Exclude selected FE
                                .map((fe) => (
                                  <div
                                    key={fe.id}
                                    className={`cursor-pointer p-4 rounded-lg border transition-all hover:shadow-md ${assignedFEs.includes(fe.id)
                                      ? 'border-green-300 bg-green-50'
                                      : 'hover:border-blue-300 hover:bg-blue-50'
                                      }`}
                                    onClick={() => setSelectedFE(fe.id)}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-medium">{fe.name}</p>
                                        <p className="text-xs text-muted-foreground">{fe.employeeCode}</p>
                                      </div>
                                      {assignedFEs.includes(fe.id) && (
                                        <Badge
                                          variant="outline"
                                          className="bg-green-100 text-green-800 border-green-300 text-xs"
                                        >
                                          Assigned
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="mt-2 space-y-1">
                                      <p className="text-xs">{fe.territory}, {fe.region}</p>
                                      <p className="text-xs truncate text-muted-foreground">{fe.email}</p>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      /* ========== AFTER FIRST OF MONTH: MANAGER VISITS PAGE ========== */
                      <>
                        {/* Visits Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg border">
                            <p className="text-sm text-blue-700 font-medium">Total Visits</p>
                            <p className="text-2xl font-bold">{managerVisits.length}</p>
                          </div>
                          <div className="bg-red-50 p-4 rounded-lg border">
                            <p className="text-sm text-red-700 font-medium">A+ Visits</p>
                            <p className="text-2xl font-bold">
                              {managerVisits.filter(v => v.doctor.category === 'A_PLUS').length}
                            </p>
                          </div>
                          <div className="bg-orange-50 p-4 rounded-lg border">
                            <p className="text-sm text-orange-700 font-medium">A Visits</p>
                            <p className="text-2xl font-bold">
                              {managerVisits.filter(v => v.doctor.category === 'A').length}
                            </p>
                          </div>
                          {/* <div className="bg-green-50 p-4 rounded-lg border">
                            <p className="text-sm text-green-700 font-medium">Confirmed</p>
                            <p className="text-2xl font-bold">
                              {managerVisits.filter(v => v.status === 'Confirmed').length}
                            </p>
                          </div> */}
                        </div>

                        {/* Visits List */}
                        {isLoading ? (
                          <div className="space-y-4">
                            <Skeleton className="h-8 w-48" />
                            {[1, 2, 3].map((i) => (
                              <Skeleton key={i} className="h-48 w-full" />
                            ))}
                          </div>
                        ) : managerVisits.length > 0 ? (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-lg">
                                Your Visits ({managerVisits.length})
                              </h3>
                              <span className="text-sm text-muted-foreground">
                                Week {selectedWeek}, Day {selectedDay}
                              </span>
                            </div>

                            <div className="space-y-4">
                              {managerVisits.map((visit) => (
                                <ManagerVisitCard key={visit.id} visit={visit} />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Alert>
                            <Calendar className="h-4 w-4" />
                            <AlertTitle>No Visits Assigned</AlertTitle>
                            <AlertDescription>
                              You don't have any visits assigned for Week {selectedWeek}, Day {selectedDay}.
                              {selectedWeek === currentWeek && selectedDay === currentDay &&
                                " Check back later or contact your regional manager."
                              }
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Visit Notes */}
                        {managerVisits.length > 0 && (
                          <Alert className="bg-blue-50 border-blue-200">
                            <Stethoscope className="h-4 w-4 text-blue-600" />
                            <AlertTitle className="text-blue-800">Visit Information</AlertTitle>
                            <AlertDescription className="text-blue-700">
                              These are the visits you've been assigned to accompany field executives on.
                              You can request changes to your schedule using the "Request Changes" button above.
                            </AlertDescription>
                          </Alert>
                        )}
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Request Update Modal */}
      <ManagerRequestUpdateModal
        open={isRequestModalOpen}
        onOpenChange={setIsRequestModalOpen}
        doctorVisits={managerVisits.map((visit) => ({
          id: visit.visitId,
          name: visit.doctor.name,
          type: "doctor",
        }))}
        onSubmit={handleRequestUpdate}
      />
    </div>
  );
}