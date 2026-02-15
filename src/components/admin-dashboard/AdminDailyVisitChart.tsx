import { useState, useEffect } from "react";
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
import { fetchDailyVisitStatReport } from "@/services/VisitService";

type RoleType = "field_executive" | "manager";

const AdminDailyVisitChart = () => {
  const [selectedRole, setSelectedRole] = useState<RoleType>("field_executive");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Current month
  const [year, setYear] = useState(new Date().getFullYear());

//   useEffect(() => {
//     fetchDailyStats();
//   }, [selectedRole, month, year]);

  useEffect(() => {
    fetchDailyStats();
  }, []);

  const fetchDailyStats = async () => {
    try {
      setLoading(true);
      const response = await fetchDailyVisitStatReport();
    //   const result = await response.json();
    if(selectedRole==="field_executive"){
        setData(response.fieldExecutiveStats);
    }else {
        setData(response.managerStats);
    }
    } catch (error) {
      console.error("Error fetching daily stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Daily Visit Report - {month}/{year}</CardTitle>
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
        {/* Optional: Add month picker */}
        {/* <div className="flex gap-2 mt-2">
          <select 
            value={month} 
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>
                {new Date(2024, m - 1, 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select 
            value={year} 
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            {[2024, 2025].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div> */}
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">Loading...</div>
          ) : (
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
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminDailyVisitChart;