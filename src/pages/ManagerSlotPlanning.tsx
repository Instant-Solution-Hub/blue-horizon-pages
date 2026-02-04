"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { MonthlyTargetProgress } from "@/components/slot-planning/MonthlyTargetProgress";
import { WarningSection } from "@/components/slot-planning/WarningSection";
import { WeekDaySelector } from "@/components/slot-planning/WeekDaySelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, UserPlus, Send, CalendarCheck, Phone, Mail, MapPin, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchPriorityFieldExecutives,
  assignManagerToFieldExecutive
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

/* ---------------- PAGE ---------------- */

export default function ManagerSlotPlanning() {
  const { toast } = useToast();

  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedFE, setSelectedFE] = useState<number | null>(null);
  const [isFirstOfMonth, setIsFirstOfMonth] = useState(true);
  const [fieldExecutives, setFieldExecutives] = useState<FieldExecutive[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignedFEs, setAssignedFEs] = useState<number[]>([]); // Track assigned FEs locally

  const userId = Number(sessionStorage.getItem("userID"));
  const managerName = sessionStorage.getItem("userName") || "Manager";

  useEffect(() => {
    if (selectedWeek && selectedDay) {
      fetchAllocatedFEsData();
    }
  }, [selectedWeek, selectedDay]);

  /* ---------------- DATE HELPERS ---------------- */

  const today = new Date();
  const currentMonthName = today.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

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
      const response = await assignManagerToFieldExecutive(
       obj
      );

      if (response.success) {
        // Update local state to track assignment
        setAssignedFEs(prev => [...prev, feId]);

        toast({
          title: "Successfully Assigned",
          description: `You have been assigned to ${feName}'s A+ and A visits for Week ${selectedWeek}, Day ${selectedDay}.`,
        });

        // Optionally refresh the list
        // fetchAllocatedFEsData();
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
                      ? "✅ You are assigned to this FE's A+ and A visits"
                      : "📋 Available for assignment to A+ and A visits"
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
                        Assign to FE
                      </>
                    )}
                  </Button>
                ) : (
                  <Button variant="secondary" disabled className="min-w-[140px]">
                    <CalendarCheck className="h-4 w-4 mr-2" />
                    Assigned
                  </Button>
                )}
              </div>
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
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold">Manager Slot Planning</h1>
              <p className="text-muted-foreground">
                {currentMonthName} • Assign to Field Executive Visits
              </p>
            </div>

            {!isFirstOfMonth && <MonthlyTargetProgress />}
            <WarningSection isFirstOfMonth={isFirstOfMonth} />

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Assign to Field Executive Visits</CardTitle>

                {!isFirstOfMonth && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Request update functionality if needed
                    }}
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
                    onWeekChange={setSelectedWeek}
                    onDayChange={setSelectedDay}
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Select field executives for Week {selectedWeek}, Day {selectedDay}
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
                          <AlertDescription>
                            The selected field executive is no longer available. Please select another one.
                          </AlertDescription>
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
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}