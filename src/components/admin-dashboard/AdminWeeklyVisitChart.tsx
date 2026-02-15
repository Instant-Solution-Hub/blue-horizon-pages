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
import { fetchWeeklyVisitStatReport } from "@/services/VisitService";

type RoleType = "field_executive" | "manager";

interface WeeklyStat {
  week: string;
  completed: number;
  missed: number;
  pending: number;
}

const AdminWeeklyVisitChart = () => {
  const [selectedRole, setSelectedRole] = useState<RoleType>("field_executive");
  const [data, setData] = useState<WeeklyStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [fieldExecutiveStats, setFieldExecutiveStats] = useState([]);
  const [managerStats, setManagerStats] = useState([]);

  useEffect(() => {
    fetchWeeklyStats();
  }, []);

  const fetchWeeklyStats = async () => {
    try {
      setLoading(true);
      const response = await fetchWeeklyVisitStatReport();
      setFieldExecutiveStats(response.fieldExecutiveStats);
      setManagerStats(response.managerStats);
      
      if (selectedRole === "field_executive") {
        setData(response.fieldExecutiveStats);
      } else {
        setData(response.managerStats);
      }
    } catch (error) {
      console.error("Error fetching weekly stats:", error);
      // Fallback to mock data if API fails
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  
  // Handle role change
  const handleRoleChange = (role: RoleType) => {
    setSelectedRole(role);
    if (role === "field_executive") {
      setData(fieldExecutiveStats);
    } else {
      setData(managerStats);
    }
  };

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">
              Weekly Visit Report - {month}/{year}
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedRole === "field_executive" ? "default" : "outline"}
              size="sm"
              onClick={() => handleRoleChange("field_executive")}
              className={cn(
                selectedRole === "field_executive" && "bg-primary text-primary-foreground"
              )}
            >
              Field Executive
            </Button>
            <Button
              variant={selectedRole === "manager" ? "default" : "outline"}
              size="sm"
              onClick={() => handleRoleChange("manager")}
              className={cn(
                selectedRole === "manager" && "bg-primary text-primary-foreground"
              )}
            >
              Manager
            </Button>
          </div>
        </div>
        
        {/* Month Picker */}
        {/* <div className="flex gap-2 mt-2">
          <select 
            value={month} 
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="border rounded px-2 py-1 text-sm bg-white"
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
            className="border rounded px-2 py-1 text-sm bg-white"
          >
            {[2024, 2025].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <Button 
            size="sm" 
            variant="outline"
            onClick={fetchWeeklyStats}
            className="ml-auto"
          >
            Refresh
          </Button>
        </div> */}
      </CardHeader>
      
      <CardContent>
        <div className="h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading chart data...</p>
              </div>
            </div>
          ) : data.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No data available for this period</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="week" 
                  className="text-xs fill-muted-foreground"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis 
                  className="text-xs fill-muted-foreground"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  formatter={(value) => <span className="text-sm">{value}</span>}
                />
                <Bar 
                  dataKey="completed" 
                  name="Completed" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={60}
                />
                <Bar 
                  dataKey="missed" 
                  name="Missed" 
                  fill="#ef4444" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={60}
                />
                <Bar 
                  dataKey="pending" 
                  name="Pending" 
                  fill="#f59e0b" 
                  radius={[4, 4, 0, 0]} 
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        
        {/* Summary Stats */}
        {!loading && data.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Completed</p>
              <p className="text-2xl font-bold text-primary">
                {data.reduce((sum, item) => sum + item.completed, 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Missed</p>
              <p className="text-2xl font-bold text-red-500">
                {data.reduce((sum, item) => sum + item.missed, 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Pending</p>
              <p className="text-2xl font-bold text-orange-500">
                {data.reduce((sum, item) => sum + item.pending, 0)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminWeeklyVisitChart;