import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { FilterState } from "./MobileFilterSheet";

interface FiltersSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const FiltersSidebar = ({ filters, onFilterChange }: FiltersSidebarProps) => {
  const eventTypes = [
    { id: "missa", label: "Missa" },
    { id: "confissao", label: "Confissão" },
    { id: "adoracao", label: "Adoração" },
    { id: "terco", label: "Terço" },
  ];

  const timeOfDay = [
    { id: "manha", label: "Manhã (6h - 12h)" },
    { id: "tarde", label: "Tarde (12h - 18h)" },
    { id: "noite", label: "Noite (18h - 22h)" },
  ];

  const neighborhoods = [
    "Gleba Palhano",
    "Centro",
    "Zona Norte",
    "Zona Sul",
    "Cambé",
    "Todos os bairros",
  ];

  const handleEventTypeChange = (typeId: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.eventTypes, typeId]
      : filters.eventTypes.filter((t) => t !== typeId);
    onFilterChange({ ...filters, eventTypes: newTypes });
  };

  const handleTimeOfDayChange = (timeId: string, checked: boolean) => {
    const newTimes = checked
      ? [...filters.timeOfDay, timeId]
      : filters.timeOfDay.filter((t) => t !== timeId);
    onFilterChange({ ...filters, timeOfDay: newTimes });
  };

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="bg-card rounded-xl p-5 card-shadow sticky top-24">
        <div className="flex items-center gap-2 mb-5">
          <Filter className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Filtros</h2>
        </div>

        {/* Event Type */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Tipo de Evento
          </h3>
          <div className="space-y-3">
            {eventTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={type.id}
                  checked={filters.eventTypes.includes(type.id)}
                  onCheckedChange={(checked) =>
                    handleEventTypeChange(type.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={type.id}
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Time of Day */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-foreground mb-3">
            Horário do Dia
          </h3>
          <div className="space-y-3">
            {timeOfDay.map((time) => (
              <div key={time.id} className="flex items-center space-x-2">
                <Checkbox
                  id={time.id}
                  checked={filters.timeOfDay.includes(time.id)}
                  onCheckedChange={(checked) =>
                    handleTimeOfDayChange(time.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={time.id}
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  {time.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Neighborhoods */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-foreground mb-3">Bairros</h3>
          <Select
            value={filters.neighborhood}
            onValueChange={(value) =>
              onFilterChange({ ...filters, neighborhood: value })
            }
          >
            <SelectTrigger className="w-full bg-secondary border-0">
              <SelectValue placeholder="Selecione um bairro" />
            </SelectTrigger>
            <SelectContent className="bg-card border border-border">
              {neighborhoods.map((neighborhood) => (
                <SelectItem
                  key={neighborhood}
                  value={neighborhood.toLowerCase().replace(/\s/g, "-")}
                >
                  {neighborhood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Official Parishes Toggle */}
        <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
          <div>
            <Label
              htmlFor="official-only"
              className="text-sm font-medium text-foreground cursor-pointer"
            >
              Apenas Paróquias Oficiais
            </Label>
            <p className="text-xs text-muted-foreground">
              Verificadas pela Diocese
            </p>
          </div>
          <Switch
            id="official-only"
            checked={filters.officialOnly}
            onCheckedChange={(checked) =>
              onFilterChange({ ...filters, officialOnly: checked })
            }
          />
        </div>
      </div>
    </aside>
  );
};

export default FiltersSidebar;
