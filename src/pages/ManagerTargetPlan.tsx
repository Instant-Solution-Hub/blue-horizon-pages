import { useState, useMemo } from "react";
import ManagerSidebar from "@/components/manager-dashboard/ManagerSidebar";
import ManagerHeader from "@/components/manager-dashboard/ManagerHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Target, TrendingUp } from "lucide-react";
import SetTargetModal from "@/components/manager-target-plan/SetTargetModal";
import FETargetsList from "@/components/manager-target-plan/FETargetList";
import TerritoryTargetTable, { TerritoryData } from "@/components/manager-target-plan/TerritoryTargetTable";
import { useEffect } from "react";
import { getFEMonthlyTargets , assignMonthlyTarget , getTerritoryTargets , updateTerritoryTarget } from "@/services/ManagerTargetService";




interface FETarget {
  id: string;
  name: string;
  territory: string;
  primaryTarget: number;
  secondaryTarget: number;
}

interface TerritoryTarget {
  id: number;
  territory: string;

  primaryTargetSet: number;
  secondaryTargetSet: number;

  primaryTargetAchieved: number;
  secondaryTargetAchieved: number;

  primaryDeficit: number;
  secondaryDeficit: number;

  subStockistStock: number;
}



const now = new Date();

const currentMonth = now.getMonth() + 1; // JS months are 0-based
const currentYear = now.getFullYear();

const ManagerTargetPlan = () => {
    const managerId = Number(sessionStorage.getItem("userID"));
const month = new Date().getMonth() + 1;
const year = new Date().getFullYear();
  const [isSetTargetOpen, setIsSetTargetOpen] = useState(false);

  const [feTargets, setFeTargets] = useState<FETarget[]>([]);
  const [territoryTargets, setTerritoryTargets] = useState<TerritoryTarget[]>([]);


  useEffect(() => {
  const fetchTargets = async () => {
    try {
      const data = await getFEMonthlyTargets(managerId, month, year);

      const mappedTargets: FETarget[] = data.map((item: any) => ({
        id: String(item.feId),
        name: item.feName,
        territory: item.territory,
        primaryTarget: item.primaryTargetSet,
        secondaryTarget: item.secondaryTargetSet,
      }));

      setFeTargets(mappedTargets);
    } catch (err) {
      console.error("Failed to fetch FE targets", err);
    }
  };

  fetchTargets();
}, []);

useEffect(() => {
  const fetchTerritoryTargets = async () => {
    try {
      const data = await getTerritoryTargets(managerId, month, year);
      setTerritoryTargets(data);
    } catch (err) {
      console.error("Failed to load territory targets", err);
    }
  };

  fetchTerritoryTargets();
}, [managerId, month, year , feTargets]);

  


  // Aggregate targets by territory
const territoryData = useMemo<TerritoryData[]>(() => {
  return territoryTargets.map((t) => ({
    id: t.id,
    territory: t.territory,

    // targets
    primaryTarget: t.primaryTargetSet,
    secondaryTarget: t.secondaryTargetSet,

    // achieved == weekly sale (for now)
    weeklyPrimarySale: t.primaryTargetAchieved,
    weeklySecondarySale: t.secondaryTargetAchieved,

    // stock
    totalSubstockistStock: t.subStockistStock,
  }));
}, [territoryTargets]);



  const handleSetTarget = async (data: {
  feId: string;
  primaryTarget: number;
  secondaryTarget: number;
}) => {
  const response = await assignMonthlyTarget(data.feId, {
    month: currentMonth,
    year: currentYear,
    primaryTargetSet: data.primaryTarget,
    secondaryTargetSet: data.secondaryTarget,
  });

  setFeTargets((prev) => {
    const index = prev.findIndex((t) => t.id === response.feId.toString());

    if (index !== -1) {
      const updated = [...prev];
      updated[index] = {
        id: response.feId.toString(),
        name: response.feName,
        territory: response.territory,
        primaryTarget: response.primaryTarget,
        secondaryTarget: response.secondaryTarget,
      };
      return updated;
    }

    return [
      ...prev,
      {
        id: response.feId.toString(),
        name: response.feName,
        territory: response.territory,
        primaryTarget: response.primaryTarget,
        secondaryTarget: response.secondaryTarget,
      },
    ];
  });
};

const handleUpdateTerritoryData = async (
  territoryId: number,
  field: string,
  value: number
) => {
  try {
    const payload: any = {};

    if (field === "weeklyPrimarySale") {
      payload.primaryTargetAchieved = value;
    } else if (field === "weeklySecondarySale") {
      payload.secondaryTargetAchieved = value;
    } else if (field === "totalSubstockistStock") {
      payload.subStockistStock = value;
    } else {
      return;
    }

    const updated = await updateTerritoryTarget(territoryId, payload);

    // update local state
    setTerritoryTargets((prev) =>
      prev.map((t) =>
        t.id === territoryId
          ? {
              ...t,
              primaryTargetAchieved: updated.primaryTargetAchieved,
              secondaryTargetAchieved: updated.secondaryTargetAchieved,
              subStockistStock: updated.subStockistStock,
              primaryDeficit: updated.primaryDeficit,
              secondaryDeficit: updated.secondaryDeficit,
            }
          : t
      )
    );
  } catch (err) {
    console.error("Failed to update territory target", err);
  }
};

  // Calculate totals for stats
  const totalPrimaryTarget = feTargets.reduce((sum, t) => sum + t.primaryTarget, 0);
  const totalSecondaryTarget = feTargets.reduce((sum, t) => sum + t.secondaryTarget, 0);

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <ManagerSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ManagerHeader />

        <main className="flex-1 p-6 overflow-y-auto">
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
        fieldExecutives={feTargets}
        onSetTarget={handleSetTarget}
      />
    </div>
  );
};

export default ManagerTargetPlan;
