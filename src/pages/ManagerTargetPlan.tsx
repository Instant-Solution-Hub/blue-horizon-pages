import { useState, useMemo } from "react";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import ManagerHeader from "@/components/manager-dashboard/ManagerHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Target, TrendingUp } from "lucide-react";
import SetTargetModal from "@/components/manager-target-plan/SetTargetModal";
import FETargetsList from "@/components/manager-target-plan/FETargetsList";
import TerritoryTargetTable from "@/components/manager-target-plan/TerritoryTargetTable";

// Mock Field Executives data
const mockFieldExecutives = [
  { id: "1", name: "Rajesh Kumar", territory: "North Mumbai" },
  { id: "2", name: "Priya Sharma", territory: "North Mumbai" },
  { id: "3", name: "Amit Patel", territory: "South Mumbai" },
  { id: "4", name: "Sneha Reddy", territory: "Thane" },
  { id: "5", name: "Vikram Singh", territory: "Navi Mumbai" },
  { id: "6", name: "Anita Desai", territory: "Navi Mumbai" },
];

interface FETarget {
  id: string;
  name: string;
  territory: string;
  primaryTarget: number;
  secondaryTarget: number;
}

interface TerritoryData {
  territory: string;
  primaryTarget: number;
  secondaryTarget: number;
  weeklyPrimarySale: number;
  weeklySecondarySale: number;
  totalSubstockistStock: number;
}

const ManagerTargetPlan = () => {
  const [isSetTargetOpen, setIsSetTargetOpen] = useState(false);
  const [feTargets, setFeTargets] = useState<FETarget[]>([
    { id: "1", name: "Rajesh Kumar", territory: "North Mumbai", primaryTarget: 500000, secondaryTarget: 400000 },
    { id: "2", name: "Priya Sharma", territory: "North Mumbai", primaryTarget: 450000, secondaryTarget: 350000 },
    { id: "3", name: "Amit Patel", territory: "South Mumbai", primaryTarget: 600000, secondaryTarget: 500000 },
  ]);

  const [territorySales, setTerritorySales] = useState<Record<string, { weeklyPrimarySale: number; weeklySecondarySale: number; totalSubstockistStock: number }>>({
    "North Mumbai": { weeklyPrimarySale: 200000, weeklySecondarySale: 150000, totalSubstockistStock: 80000 },
    "South Mumbai": { weeklyPrimarySale: 180000, weeklySecondarySale: 140000, totalSubstockistStock: 60000 },
    "Thane": { weeklyPrimarySale: 0, weeklySecondarySale: 0, totalSubstockistStock: 0 },
    "Navi Mumbai": { weeklyPrimarySale: 0, weeklySecondarySale: 0, totalSubstockistStock: 0 },
  });

  // Aggregate targets by territory
  const territoryData = useMemo<TerritoryData[]>(() => {
    const territoryMap: Record<string, { primaryTarget: number; secondaryTarget: number }> = {};

    feTargets.forEach((fe) => {
      if (!territoryMap[fe.territory]) {
        territoryMap[fe.territory] = { primaryTarget: 0, secondaryTarget: 0 };
      }
      territoryMap[fe.territory].primaryTarget += fe.primaryTarget;
      territoryMap[fe.territory].secondaryTarget += fe.secondaryTarget;
    });

    return Object.entries(territoryMap).map(([territory, targets]) => ({
      territory,
      primaryTarget: targets.primaryTarget,
      secondaryTarget: targets.secondaryTarget,
      weeklyPrimarySale: territorySales[territory]?.weeklyPrimarySale || 0,
      weeklySecondarySale: territorySales[territory]?.weeklySecondarySale || 0,
      totalSubstockistStock: territorySales[territory]?.totalSubstockistStock || 0,
    }));
  }, [feTargets, territorySales]);

  const handleSetTarget = (data: { feId: string; primaryTarget: number; secondaryTarget: number }) => {
    const fe = mockFieldExecutives.find((f) => f.id === data.feId);
    if (!fe) return;

    const existingIndex = feTargets.findIndex((t) => t.id === data.feId);
    if (existingIndex >= 0) {
      // Update existing target
      const updated = [...feTargets];
      updated[existingIndex] = {
        ...updated[existingIndex],
        primaryTarget: data.primaryTarget,
        secondaryTarget: data.secondaryTarget,
      };
      setFeTargets(updated);
    } else {
      // Add new target
      setFeTargets([
        ...feTargets,
        {
          id: fe.id,
          name: fe.name,
          territory: fe.territory,
          primaryTarget: data.primaryTarget,
          secondaryTarget: data.secondaryTarget,
        },
      ]);
    }

    // Initialize territory sales if not exists
    if (!territorySales[fe.territory]) {
      setTerritorySales({
        ...territorySales,
        [fe.territory]: { weeklyPrimarySale: 0, weeklySecondarySale: 0, totalSubstockistStock: 0 },
      });
    }
  };

  const handleUpdateTerritoryData = (territory: string, field: string, value: number) => {
    setTerritorySales({
      ...territorySales,
      [territory]: {
        ...territorySales[territory],
        [field]: value,
      },
    });
  };

  // Calculate totals for stats
  const totalPrimaryTarget = feTargets.reduce((sum, t) => sum + t.primaryTarget, 0);
  const totalSecondaryTarget = feTargets.reduce((sum, t) => sum + t.secondaryTarget, 0);

  return (
    <div className="flex min-h-screen bg-background">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col">
        <ManagerHeader />

        <main className="flex-1 p-6 overflow-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Primary Target</p>
                    <p className="text-2xl font-bold text-foreground">
                      ₹{(totalPrimaryTarget / 100000).toFixed(1)}L
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Secondary Target</p>
                    <p className="text-2xl font-bold text-foreground">
                      ₹{(totalSecondaryTarget / 100000).toFixed(1)}L
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Territories Covered</p>
                    <p className="text-2xl font-bold text-foreground">{territoryData.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Set Monthly Targets Section */}
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Monthly Targets by Field Executive</CardTitle>
              <Button onClick={() => setIsSetTargetOpen(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Set Target
              </Button>
            </CardHeader>
            <CardContent>
              <FETargetsList targets={feTargets} />
            </CardContent>
          </Card>

          {/* Territory-wise Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Territory-wise Target & Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <TerritoryTargetTable
                data={territoryData}
                onUpdateData={handleUpdateTerritoryData}
              />
            </CardContent>
          </Card>
        </main>
      </div>

      <SetTargetModal
        open={isSetTargetOpen}
        onOpenChange={setIsSetTargetOpen}
        fieldExecutives={mockFieldExecutives}
        onSetTarget={handleSetTarget}
      />
    </div>
  );
};

export default ManagerTargetPlan;
