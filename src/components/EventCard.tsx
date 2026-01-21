import { useState } from "react";
import { MapPin, Navigation, Heart, Star, CheckCircle2, Clock, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import VoteButtons from "./VoteButtons";
import TimeCorrectionModal from "./TimeCorrectionModal";
import SuggestionModal from "./SuggestionModal";

interface EventCardProps {
  id: string;
  time: string;
  title: string;
  parishId: string;
  parishName: string;
  address: string;
  distance: string;
  status: "official" | "community" | "unverified";
  minutesUntil?: number;
  verificationScore: number;
  lat: number;
  lng: number;
  pixKey?: string | null;
  onDonateClick: (parishName: string, pixKey: string) => void;
}

const EventCard = ({
  id,
  time,
  title,
  parishId,
  parishName,
  address,
  distance,
  status,
  minutesUntil,
  verificationScore,
  lat,
  lng,
  pixKey,
  onDonateClick,
}: EventCardProps) => {
  const [isTimeCorrectionOpen, setIsTimeCorrectionOpen] = useState(false);
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);

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

  const handleNavigate = () => {
    // Use coordinates from database
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  const handleDonate = () => {
    onDonateClick(parishName, pixKey || "00.000.000/0001-99");
  };

  return (
    <>
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
            
            {/* Vote Buttons */}
            <VoteButtons 
              eventId={id} 
              verificationScore={verificationScore}
              onDownvote={() => setIsTimeCorrectionOpen(true)}
            />
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
        <div className="p-4 pt-2 space-y-2">
          <div className="flex gap-2">
            <Button
              onClick={handleNavigate}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Navigation className="h-4 w-4 mr-2" />
              Navegar
            </Button>
            <Button
              onClick={handleDonate}
              variant="outline"
              className="flex-1 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <Heart className="h-4 w-4 mr-2" />
              Doar via Pix
            </Button>
          </div>
          
          {/* Suggest Correction Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSuggestionOpen(true)}
            className="w-full text-xs text-muted-foreground hover:text-primary"
          >
            <MessageSquarePlus className="h-3 w-3 mr-1" />
            Sugerir Correção
          </Button>
        </div>
      </article>

      {/* Time Correction Modal */}
      <TimeCorrectionModal
        isOpen={isTimeCorrectionOpen}
        onClose={() => setIsTimeCorrectionOpen(false)}
        eventId={id}
        currentTime={time}
        parishName={parishName}
      />

      {/* Suggestion Modal */}
      <SuggestionModal
        isOpen={isSuggestionOpen}
        onClose={() => setIsSuggestionOpen(false)}
        parishId={parishId}
        parishName={parishName}
      />
    </>
  );
};

export default EventCard;
