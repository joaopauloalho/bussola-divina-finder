import EventCard from "./EventCard";
import SponsoredCard from "./SponsoredCard";
import EmptyState from "./EmptyState";
import { FilterState } from "./MobileFilterSheet";
import { useEvents, EventWithDetails } from "@/hooks/useEvents";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, MapPinOff } from "lucide-react";

// Helper function to map event types to filter types
const getEventTypeFilter = (type: string): string => {
  const typeMap: Record<string, string> = {
    "Missa": "missa",
    "Confissão": "confissao",
    "Adoração": "adoracao",
    "Terço": "terco",
  };
  return typeMap[type] || "";
};

// Helper function to get time of day from event time
const getTimeOfDay = (time: string): string => {
  const hour = parseInt(time.split(":")[0], 10);
  if (hour >= 6 && hour < 12) return "manha";
  if (hour >= 12 && hour < 18) return "tarde";
  if (hour >= 18 && hour < 22) return "noite";
  return "";
};

interface EventsGridProps {
  filters: FilterState;
  onDonateClick: (parishName: string, pixKey: string) => void;
  onSuggestClick?: () => void;
}

const EventsGrid = ({ 
  filters = { eventTypes: [], timeOfDay: [], neighborhood: "todos-os-bairros", officialOnly: false, dayOfWeek: null }, 
  onDonateClick,
  onSuggestClick,
}: EventsGridProps) => {
  const { location, loading: locationLoading } = useGeolocation();
  const { data: events, isLoading, error } = useEvents(location);

  // Filter events based on current filters
  const filteredEvents = (events || []).filter((event: EventWithDetails) => {
    // Filter by day of week
    if (filters.dayOfWeek !== null && event.day_of_week !== filters.dayOfWeek) {
      return false;
    }

    // Filter by event type
    if (filters.eventTypes.length > 0) {
      const eventType = getEventTypeFilter(event.type);
      if (!filters.eventTypes.includes(eventType)) {
        return false;
      }
    }

    // Filter by time of day
    if (filters.timeOfDay.length > 0) {
      const timeOfDay = getTimeOfDay(event.formattedTime);
      if (!filters.timeOfDay.includes(timeOfDay)) {
        return false;
      }
    }

    // Filter by official only
    if (filters.officialOnly && !event.parish.is_official) {
      return false;
    }

    return true;
  });

  if (isLoading) {
    return (
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl p-4 card-shadow">
              <Skeleton className="h-8 w-20 mb-3" />
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-4 w-40 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1">
        <div className="text-center py-12 text-destructive">
          Erro ao carregar eventos. Tente novamente mais tarde.
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Location and results info */}
      <div className="flex items-center justify-end gap-3 mb-4">
        {/* Location indicator */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {locationLoading ? (
            <span>Buscando localização...</span>
          ) : location ? (
            <>
              <MapPin className="h-3 w-3 text-success" />
              <span>Ordenado por distância</span>
            </>
          ) : (
            <>
              <MapPinOff className="h-3 w-3" />
              <span>Localização indisponível</span>
            </>
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          {filteredEvents.length} resultados
        </span>
      </div>

      {filteredEvents.length === 0 ? (
        <EmptyState onSuggestClick={onSuggestClick} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredEvents.map((event: EventWithDetails, index: number) => {
            const elements = [
              <EventCard
                key={`event-${event.id}`}
                id={event.id}
                time={event.formattedTime}
                title={event.type}
                parishId={event.parish.id}
                parishName={event.parish.name}
                address={event.parish.address}
                distance={event.distance}
                status={event.status}
                minutesUntil={event.minutesUntil}
                verificationScore={event.verification_score}
                lat={event.parish.lat}
                lng={event.parish.lng}
                pixKey={event.parish.pix_key}
                onDonateClick={onDonateClick}
              />,
            ];
            if (index === 2) {
              elements.push(<SponsoredCard key="sponsored" />);
            }
            return elements;
          })}
        </div>
      )}
    </div>
  );
};

export default EventsGrid;
