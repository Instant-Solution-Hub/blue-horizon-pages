import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";

type RoleType = "field_executive" | "manager";

const feData = [
  { day: "Mon", completed: 28, missed: 5, pending: 3 },
  { day: "Tue", completed: 32, missed: 3, pending: 4 },
  { day: "Wed", completed: 25, missed: 7, pending: 2 },
  { day: "Thu", completed: 30, missed: 4, pending: 6 },
  { day: "Fri", completed: 35, missed: 2, pending: 1 },
  { day: "Sat", completed: 18, missed: 1, pending: 0 },
];

const managerData = [
  { day: "Mon", completed: 8, missed: 2, pending: 1 },
  { day: "Tue", completed: 10, missed: 1, pending: 2 },
  { day: "Wed", completed: 7, missed: 3, pending: 1 },
  { day: "Thu", completed: 9, missed: 2, pending: 3 },
  { day: "Fri", completed: 11, missed: 1, pending: 0 },
  { day: "Sat", completed: 5, missed: 0, pending: 1 },
];

const AdminDailyVisitChart = () => {
  const [selectedRole, setSelectedRole] = useState<RoleType>("field_executive");

  const data = selectedRole === "field_executive" ? feData : managerData;

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Daily Visit Report</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedRole === "field_executive" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRole("field_executive")}
              className={cn(
                selectedRole === "field_executive" && "bg-primary text-primary-foreground"
              )}
            >
              Field Executive
            </Button>
            <Button
              variant={selectedRole === "manager" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedRole("manager")}
              className={cn(
                selectedRole === "manager" && "bg-primary text-primary-foreground"
              )}
            >
              Manager
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="day"
                className="text-xs fill-muted-foreground"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                className="text-xs fill-muted-foreground"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend />
              <Bar dataKey="completed" name="Completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="missed" name="Missed" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDailyVisitChart;
