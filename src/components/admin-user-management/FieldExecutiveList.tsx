import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface FieldExecutive {
  id: string;
  name: string;
  email: string;
  phone: string;
  employeeCode: string;
  territory: string;
  region: string;
  markets: string[];
  managerId: string;
  managerName: string;
}

interface FieldExecutiveListProps {
  fieldExecutives: FieldExecutive[];
  onEdit: (fe: FieldExecutive) => void;
}

const FieldExecutiveList = ({ fieldExecutives, onEdit }: FieldExecutiveListProps) => {
  return (
    <div className="space-y-3">
      {fieldExecutives.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No field executives added yet</p>
      ) : (
        fieldExecutives.map((fe) => (
          <Card key={fe.id} className="bg-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{fe.name}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                      {fe.employeeCode}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{fe.email}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Phone: </span>
                      <span className="text-foreground">{fe.phone}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Territory: </span>
                      <span className="text-foreground">{fe.territory}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Region: </span>
                      <span className="text-foreground">{fe.region}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Manager: </span>
                      <span className="text-foreground">{fe.managerName}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Markets: </span>
                      <span className="text-foreground">{fe.markets.join(", ")}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(fe)}
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

export default FieldExecutiveList;
