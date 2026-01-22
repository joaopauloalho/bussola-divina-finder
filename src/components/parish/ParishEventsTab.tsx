import { ParishEvent, getDayName, formatTime } from "@/hooks/useParish";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ParishEventsTabProps {
  events: ParishEvent[];
}

const eventTypeConfig: Record<string, { color: string; label: string }> = {
  Missa: { color: "bg-primary/10 text-primary border-primary/30", label: "Missa" },
  Confissão: { color: "bg-accent/20 text-accent-foreground border-accent", label: "Confissão" },
  Adoração: { color: "bg-success/10 text-success border-success/30", label: "Adoração" },
  Terço: { color: "bg-muted text-muted-foreground border-border", label: "Terço" },
};

const ParishEventsTab = ({ events }: ParishEventsTabProps) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium text-foreground mb-1">
          Nenhum evento cadastrado
        </h3>
        <p className="text-muted-foreground">
          Esta paróquia ainda não possui eventos registrados.
        </p>
      </div>
    );
  }

  // Group events by day of week
  const eventsByDay = events.reduce((acc, event) => {
    const day = event.day_of_week;
    if (!acc[day]) acc[day] = [];
    acc[day].push(event);
    return acc;
  }, {} as Record<number, ParishEvent[]>);

  // Sort days starting from Sunday (0)
  const sortedDays = Object.keys(eventsByDay)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      {sortedDays.map((day) => (
        <div key={day} className="bg-card rounded-lg card-shadow overflow-hidden">
          <div className="bg-primary/5 px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              {getDayName(day)}
            </h3>
          </div>
          <div className="divide-y divide-border">
            {eventsByDay[day].map((event) => {
              const typeConfig = eventTypeConfig[event.type] || eventTypeConfig.Missa;
              return (
                <div
                  key={event.id}
                  className="px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 min-w-20">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {formatTime(event.time)}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", typeConfig.color)}
                    >
                      {typeConfig.label}
                    </Badge>
                  </div>
                  {event.verification_score > 0 && (
                    <span className="text-xs text-muted-foreground">
                      +{event.verification_score} confirmações
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ParishEventsTab;
