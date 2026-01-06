import EventCard from "./EventCard";
import SponsoredCard from "./SponsoredCard";

const eventsData = [
  {
    time: "07:00",
    title: "Santa Missa",
    parishName: "Paróquia Sagrados Corações",
    address: "Av. Higienópolis, 1234",
    distance: "800m",
    status: "official" as const,
  },
  {
    time: "08:30",
    title: "Confissão",
    parishName: "Igreja São José Operário",
    address: "Rua Pará, 567",
    distance: "1.2km",
    status: "community" as const,
  },
  {
    time: "10:00",
    title: "Santa Missa",
    parishName: "Catedral Metropolitana",
    address: "Praça Rocha Pombo, 10",
    distance: "2.5km",
    status: "official" as const,
    minutesUntil: 20,
  },
  {
    time: "15:00",
    title: "Adoração ao Santíssimo",
    parishName: "Paróquia Nossa Senhora Aparecida",
    address: "Rua Santos Dumont, 890",
    distance: "1.8km",
    status: "official" as const,
  },
  {
    time: "17:30",
    title: "Terço Mariano",
    parishName: "Capela São Francisco",
    address: "Av. JK, 456",
    distance: "3.1km",
    status: "unverified" as const,
  },
  {
    time: "19:00",
    title: "Santa Missa",
    parishName: "Paróquia Sagrado Coração de Jesus",
    address: "Rua Sergipe, 234",
    distance: "1.5km",
    status: "community" as const,
    minutesUntil: 45,
  },
  {
    time: "20:00",
    title: "Confissão",
    parishName: "Igreja Santa Terezinha",
    address: "Av. Madre Leônia, 789",
    distance: "2.0km",
    status: "official" as const,
  },
  {
    time: "21:00",
    title: "Adoração Noturna",
    parishName: "Santuário do Pequeno Cotolengo",
    address: "Estrada do Limoeiro, km 3",
    distance: "5.2km",
    status: "official" as const,
  },
];

const EventsGrid = () => {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">
          Próximos Eventos
        </h2>
        <span className="text-sm text-muted-foreground">
          {eventsData.length} resultados
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {eventsData.map((event, index) => {
          const elements = [<EventCard key={`event-${index}`} {...event} />];
          if (index === 2) {
            elements.push(<SponsoredCard key="sponsored" />);
          }
          return elements;
        })}
      </div>
    </div>
  );
};

export default EventsGrid;
