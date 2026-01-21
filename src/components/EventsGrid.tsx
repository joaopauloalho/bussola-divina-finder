import EventCard from "./EventCard";
import SponsoredCard from "./SponsoredCard";
import EmptyState from "./EmptyState";
import { FilterState } from "./MobileFilterSheet";

export interface EventData {
  time: string;
  title: string;
  parishName: string;
  address: string;
  distance: string;
  status: "official" | "community" | "unverified";
  minutesUntil?: number;
}

const eventsData: EventData[] = [
  {
    time: "07:00",
    title: "Santa Missa",
    parishName: "Paróquia Sagrados Corações",
    address: "Av. Higienópolis, 1234",
    distance: "800m",
    status: "official",
  },
  {
    time: "08:30",
    title: "Confissão",
    parishName: "Igreja São José Operário",
    address: "Rua Pará, 567",
    distance: "1.2km",
    status: "community",
  },
  {
    time: "10:00",
    title: "Santa Missa",
    parishName: "Catedral Metropolitana",
    address: "Praça Rocha Pombo, 10",
    distance: "2.5km",
    status: "official",
    minutesUntil: 20,
  },
  {
    time: "15:00",
    title: "Adoração ao Santíssimo",
    parishName: "Paróquia Nossa Senhora Aparecida",
    address: "Rua Santos Dumont, 890",
    distance: "1.8km",
    status: "official",
  },
  {
    time: "17:30",
    title: "Terço Mariano",
    parishName: "Capela São Francisco",
    address: "Av. JK, 456",
    distance: "3.1km",
    status: "unverified",
  },
  {
    time: "19:00",
    title: "Santa Missa",
    parishName: "Paróquia Sagrado Coração de Jesus",
    address: "Rua Sergipe, 234",
    distance: "1.5km",
    status: "community",
    minutesUntil: 45,
  },
  {
    time: "20:00",
    title: "Confissão",
    parishName: "Igreja Santa Terezinha",
    address: "Av. Madre Leônia, 789",
    distance: "2.0km",
    status: "official",
  },
  {
    time: "21:00",
    title: "Adoração Noturna",
    parishName: "Santuário do Pequeno Cotolengo",
    address: "Estrada do Limoeiro, km 3",
    distance: "5.2km",
    status: "official",
  },
];

// Helper function to map event titles to filter types
const getEventType = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("missa")) return "missa";
  if (lowerTitle.includes("confissão")) return "confissao";
  if (lowerTitle.includes("adoração")) return "adoracao";
  if (lowerTitle.includes("terço")) return "terco";
  return "";
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
  onDonateClick: (parishName: string) => void;
}

const EventsGrid = ({ filters = { eventTypes: [], timeOfDay: [], neighborhood: "todos-os-bairros", officialOnly: false }, onDonateClick }: EventsGridProps) => {
  // Filter events based on current filters
  const filteredEvents = eventsData.filter((event) => {
    // Filter by event type
    if (filters.eventTypes.length > 0) {
      const eventType = getEventType(event.title);
      if (!filters.eventTypes.includes(eventType)) {
        return false;
      }
    }

    // Filter by time of day
    if (filters.timeOfDay.length > 0) {
      const timeOfDay = getTimeOfDay(event.time);
      if (!filters.timeOfDay.includes(timeOfDay)) {
        return false;
      }
    }

    // Filter by official only
    if (filters.officialOnly && event.status !== "official") {
      return false;
    }

    return true;
  });

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">
          Próximos Eventos
        </h2>
        <span className="text-sm text-muted-foreground">
          {filteredEvents.length} resultados
        </span>
      </div>

      {filteredEvents.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredEvents.map((event, index) => {
            const elements = [
              <EventCard
                key={`event-${index}`}
                {...event}
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
