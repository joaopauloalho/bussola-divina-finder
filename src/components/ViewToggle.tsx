import { List, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ViewMode = "list" | "map";

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const ViewToggle = ({ viewMode, onViewModeChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 px-3 gap-1.5",
          viewMode === "list" && "bg-background shadow-sm"
        )}
        onClick={() => onViewModeChange("list")}
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline text-sm">Lista</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 px-3 gap-1.5",
          viewMode === "map" && "bg-background shadow-sm"
        )}
        onClick={() => onViewModeChange("map")}
      >
        <Map className="h-4 w-4" />
        <span className="hidden sm:inline text-sm">Mapa</span>
      </Button>
    </div>
  );
};

export default ViewToggle;
