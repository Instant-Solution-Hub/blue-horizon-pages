import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Receipt,
  Plane,
  Shield,
  HeartPulse,
  ExternalLink,
} from "lucide-react";

interface Policy {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  url: string;
}

const policies: Policy[] = [
  {
    id: "leave",
    icon: FileText,
    title: "Leave Policies",
    description: "Guidelines for applying and managing leaves",
    url: "/policies/leave",
  },
  {
    id: "expense",
    icon: Receipt,
    title: "Expense Reimbursement",
    description: "Process for claiming business expenses",
    url: "/policies/expense-reimbursement",
  },
  {
    id: "travel",
    icon: Plane,
    title: "Travel Guidelines",
    description: "Rules and allowances for business travel",
    url: "/policies/travel",
  },
  {
    id: "conduct",
    icon: Shield,
    title: "Code of Conduct",
    description: "Professional standards and ethics",
    url: "/policies/code-of-conduct",
  },
  {
    id: "safety",
    icon: HeartPulse,
    title: "Safety Protocols",
    description: "Workplace safety and health guidelines",
    url: "/policies/safety",
  },
];

const CompanyPolicies = () => {
  const handleNavigate = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {policies.map((policy) => (
        <Card
          key={policy.id}
          className="border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          onClick={() => handleNavigate(policy.url)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <policy.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                    {policy.title}
                  </h4>
                  <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {policy.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CompanyPolicies;
