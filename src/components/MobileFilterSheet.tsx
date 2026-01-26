import { Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export interface FilterState {
  eventTypes: string[];
  timeOfDay: string[];
  neighborhood: string;
  officialOnly: boolean;
  dayOfWeek: number | null; // null = all days, 0-6 = specific day
}

interface MobileFilterSheetProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const daysOfWeek = [
  { id: 0, short: "Dom", full: "Domingo" },
  { id: 1, short: "Seg", full: "Segunda" },
  { id: 2, short: "Ter", full: "Terça" },
  { id: 3, short: "Qua", full: "Quarta" },
  { id: 4, short: "Qui", full: "Quinta" },
  { id: 5, short: "Sex", full: "Sexta" },
  { id: 6, short: "Sáb", full: "Sábado" },
];

const MobileFilterSheet = ({ filters = { eventTypes: [], timeOfDay: [], neighborhood: "todos-os-bairros", officialOnly: false, dayOfWeek: null }, onFilterChange }: MobileFilterSheetProps) => {
  const today = new Date().getDay();
  
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
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden fixed bottom-6 right-6 z-40 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 border-0"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 bg-card border-border">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <Filter className="h-5 w-5 text-primary" />
            Filtros
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Day of Week */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Dia da Semana
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => onFilterChange({ ...filters, dayOfWeek: today })}
                className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  filters.dayOfWeek === today
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
              >
                Hoje ({daysOfWeek[today].full})
              </button>
              <ToggleGroup
                type="single"
                value={filters.dayOfWeek?.toString() ?? ""}
                onValueChange={(value) =>
                  onFilterChange({
                    ...filters,
                    dayOfWeek: value === "" ? null : parseInt(value, 10),
                  })
                }
                className="flex flex-wrap gap-1"
              >
                {daysOfWeek.map((day) => (
                  <ToggleGroupItem
                    key={day.id}
                    value={day.id.toString()}
                    size="sm"
                    className="flex-1 min-w-[40px] text-xs"
                  >
                    {day.short}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              {filters.dayOfWeek !== null && (
                <button
                  onClick={() => onFilterChange({ ...filters, dayOfWeek: null })}
                  className="w-full py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mostrar todos os dias
                </button>
              )}
            </div>
          </div>

          {/* Event Type */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">
              Tipo de Evento
            </h3>
            <div className="space-y-3">
              {eventTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mobile-${type.id}`}
                    checked={filters.eventTypes.includes(type.id)}
                    onCheckedChange={(checked) =>
                      handleEventTypeChange(type.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`mobile-${type.id}`}
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Time of Day */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">
              Horário do Dia
            </h3>
            <div className="space-y-3">
              {timeOfDay.map((time) => (
                <div key={time.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mobile-${time.id}`}
                    checked={filters.timeOfDay.includes(time.id)}
                    onCheckedChange={(checked) =>
                      handleTimeOfDayChange(time.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`mobile-${time.id}`}
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    {time.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Neighborhoods */}
          <div>
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
                htmlFor="mobile-official-only"
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                Apenas Paróquias Oficiais
              </Label>
              <p className="text-xs text-muted-foreground">
                Verificadas pela Diocese
              </p>
            </div>
            <Switch
              id="mobile-official-only"
              checked={filters.officialOnly}
              onCheckedChange={(checked) =>
                onFilterChange({ ...filters, officialOnly: checked })
              }
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilterSheet;
