import { MapPin, Navigation, Heart, Star, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EventCardProps {
  time: string;
  title: string;
  parishName: string;
  address: string;
  distance: string;
  status: "official" | "community" | "unverified";
  minutesUntil?: number;
}

const EventCard = ({
  time,
  title,
  parishName,
  address,
  distance,
  status,
  minutesUntil,
}: EventCardProps) => {
  const statusConfig = {
    official: {
      borderClass: "status-border-official",
      badgeClass: "bg-accent/20 text-accent-foreground border-accent",
      icon: Star,
      label: "Oficial",
    },
    community: {
      borderClass: "status-border-community",
      badgeClass: "bg-primary/10 text-primary border-primary/30",
      icon: CheckCircle2,
      label: "Comunidade",
    },
    unverified: {
      borderClass: "status-border-unverified",
      badgeClass: "bg-muted text-muted-foreground border-border",
      icon: CheckCircle2,
      label: "Não verificado",
    },
  };

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;
  const isLive = minutesUntil !== undefined && minutesUntil <= 60;

  return (
    <article
      className={cn(
        "bg-card rounded-xl overflow-hidden card-shadow transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1",
        currentStatus.borderClass
      )}
    >
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{time}</span>
            {isLive && minutesUntil !== undefined && (
              <Badge className="bg-success text-success-foreground border-0 animate-pulse-soft">
                <Clock className="h-3 w-3 mr-1" />
                Começa em {minutesUntil} min
              </Badge>
            )}
            {!isLive && (
              <Badge variant="secondary" className="text-muted-foreground">
                Hoje
              </Badge>
            )}
          </div>
        </div>

        {/* Event Info */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{parishName}</span>
            <Badge
              variant="outline"
              className={cn("text-xs px-1.5 py-0", currentStatus.badgeClass)}
            >
              <StatusIcon className="h-3 w-3 mr-1" />
              {currentStatus.label}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="truncate">{address}</span>
            <span className="shrink-0 text-primary font-medium">• {distance}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 pt-2 flex gap-2">
        <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Navigation className="h-4 w-4 mr-2" />
          Navegar
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
        >
          <Heart className="h-4 w-4 mr-2" />
          Doar via Pix
        </Button>
      </div>
    </article>
  );
};

export default EventCard;
