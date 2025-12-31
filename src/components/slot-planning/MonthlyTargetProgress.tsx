import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CategoryProgress {
  category: string;
  label: string;
  targetDoctors: number;
  visitsPerDoctor: number;
  completedDoctors: number;
  completedVisits: number;
  color: string;
}

const categoryData: CategoryProgress[] = [
  {
    category: "A_PLUS",
    label: "A+",
    targetDoctors: 30,
    visitsPerDoctor: 3,
    completedDoctors: 12,
    completedVisits: 36,
    color: "bg-emerald-500",
  },
  {
    category: "A",
    label: "A",
    targetDoctors: 60,
    visitsPerDoctor: 2,
    completedDoctors: 25,
    completedVisits: 50,
    color: "bg-blue-500",
  },
  {
    category: "B",
    label: "B",
    targetDoctors: 10,
    visitsPerDoctor: 1,
    completedDoctors: 4,
    completedVisits: 4,
    color: "bg-amber-500",
  },
];

export function MonthlyTargetProgress() {
  const totalTargetVisits = categoryData.reduce(
    (sum, cat) => sum + cat.targetDoctors * cat.visitsPerDoctor,
    0
  );
  const totalCompletedVisits = categoryData.reduce(
    (sum, cat) => sum + cat.completedVisits,
    0
  );
  const overallProgress = Math.round((totalCompletedVisits / totalTargetVisits) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Monthly Target Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Overall Completion</span>
            <span className="text-muted-foreground">
              {totalCompletedVisits} / {totalTargetVisits} visits ({overallProgress}%)
            </span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>

        {/* Category-wise Progress */}
        <div className="grid gap-4 md:grid-cols-3">
          {categoryData.map((cat) => {
            const targetVisits = cat.targetDoctors * cat.visitsPerDoctor;
            const progress = Math.round((cat.completedVisits / targetVisits) * 100);
            const doctorProgress = Math.round((cat.completedDoctors / cat.targetDoctors) * 100);

            return (
              <Card key={cat.category} className="bg-muted/30">
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-xl font-bold ${cat.color.replace('bg-', 'text-')}`}>
                      Category {cat.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {cat.visitsPerDoctor}x visits each
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Doctors</span>
                      <span>{cat.completedDoctors} / {cat.targetDoctors}</span>
                    </div>
                    <Progress value={doctorProgress} className="h-2" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Total Visits</span>
                      <span>{cat.completedVisits} / {targetVisits}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
