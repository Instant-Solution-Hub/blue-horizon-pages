import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface Manager {
  id: string;
  name: string;
  email: string;
  phone: string;
  employeeCode: string;
  department: string;
  designation: string;
  managedTerritories: string[];
}

interface ManagerListProps {
  managers: Manager[];
  onEdit: (manager: Manager) => void;
}

const ManagerList = ({ managers, onEdit }: ManagerListProps) => {
  return (
    <div className="space-y-3">
      {managers.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No managers added yet</p>
      ) : (
        managers.map((manager) => (
          <Card key={manager.id} className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{manager.name}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {manager.employeeCode}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{manager.email}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Phone: </span>
                      <span className="text-foreground">{manager.phone}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Department: </span>
                      <span className="text-foreground">{manager.department}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Designation: </span>
                      <span className="text-foreground">{manager.designation}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Territories: </span>
                      <span className="text-foreground">{manager.managedTerritories.join(", ")}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(manager)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ManagerList;
