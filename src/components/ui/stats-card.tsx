import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "primary" | "accent" | "success" | "warning" | "danger";
  className?: string;
}

const variants = {
  default: "bg-card border-border",
  primary: "bg-gradient-to-br from-primary-light/40 to-primary-light/20 border-primary-light",
  accent: "bg-gradient-to-br from-accent-light/40 to-accent-light/20 border-accent-light",
  success: "bg-gradient-to-br from-green-50 to-green-100 border-green-200",
  warning: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200",
  danger: "bg-gradient-to-br from-red-50 to-red-100 border-red-200",
};

const iconColors = {
  default: "text-muted-foreground",
  primary: "text-primary",
  accent: "text-accent",
  success: "text-green-600",
  warning: "text-amber-600",
  danger: "text-red-600",
};

const valueColors = {
  default: "text-foreground",
  primary: "text-primary",
  accent: "text-accent",
  success: "text-green-800",
  warning: "text-amber-800",
  danger: "text-red-800",
};

export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  variant = "default",
  className 
}: StatsCardProps) => {
  return (
    <Card className={cn(variants[variant], className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon className={cn("w-5 h-5", iconColors[variant])} />
          <span className={cn("text-xs font-medium uppercase tracking-wider", iconColors[variant])}>
            {title}
          </span>
        </div>
        <div className={cn("text-2xl font-bold", valueColors[variant])}>
          {value}
        </div>
        {trend && (
          <div className={cn("text-xs", iconColors[variant])}>
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
};