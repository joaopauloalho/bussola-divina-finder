import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { Star, Church } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/useEvents";
import { useGeolocation } from "@/hooks/useGeolocation";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Fix for default marker icons not loading
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Default center: Londrina, PR
const LONDRINA_CENTER: [number, number] = [-23.3045, -51.1696];
const DEFAULT_ZOOM = 13;

interface ParishMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  imageUrl: string | null;
  status: "official" | "community" | "unverified";
  nextEventTime?: string;
  nextEventType?: string;
}

// Component to recenter map when user location changes
const MapRecenter = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, DEFAULT_ZOOM);
  }, [center, map]);
  
  return null;
};

// Create custom div icons for markers
const createCustomIcon = (status: "official" | "community" | "unverified") => {
  const isOfficial = status === "official";
  const bgColor = isOfficial ? "bg-amber-400" : "bg-primary";
  const borderColor = isOfficial ? "border-amber-500" : "border-primary/80";
  const iconColor = isOfficial ? "text-amber-800" : "text-primary-foreground";
  
  const IconComponent = isOfficial ? Star : Church;
  
  const iconHtml = renderToStaticMarkup(
    <div className={`w-10 h-10 ${bgColor} ${borderColor} border-2 rounded-full flex items-center justify-center shadow-lg transform -translate-x-1/2 -translate-y-full`}>
      <IconComponent className={`w-5 h-5 ${iconColor}`} fill={isOfficial ? "currentColor" : "none"} />
      {/* Pin tail */}
      <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] ${isOfficial ? "border-t-amber-400" : "border-t-primary"} border-l-transparent border-r-transparent`} />
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: "custom-parish-marker",
    iconSize: [40, 52],
    iconAnchor: [20, 52],
    popupAnchor: [0, -52],
  });
};

const ParishMap = () => {
  const navigate = useNavigate();
  const { location } = useGeolocation();
  const { data: events } = useEvents(location);

  // Group events by parish and get unique parishes with their next event
  const parishes = useMemo<ParishMarker[]>(() => {
    if (!events) return [];

    const parishMap = new Map<string, ParishMarker>();
    const today = new Date().getDay();

    events.forEach((event) => {
      if (!parishMap.has(event.parish.id)) {
        // Find next event for this parish (today)
        const todayEvents = events.filter(
          (e) => e.parish.id === event.parish.id && e.day_of_week === today
        );
        const nextEvent = todayEvents[0];

        parishMap.set(event.parish.id, {
          id: event.parish.id,
          name: event.parish.name,
          lat: event.parish.lat,
          lng: event.parish.lng,
          address: event.parish.address,
          imageUrl: event.parish.image_url,
          status: event.status,
          nextEventTime: nextEvent?.formattedTime,
          nextEventType: nextEvent?.type,
        });
      }
    });

    return Array.from(parishMap.values());
  }, [events]);

  // Determine map center based on user location or default
  const mapCenter = useMemo<[number, number]>(() => {
    if (location) {
      return [location.lat, location.lng];
    }
    return LONDRINA_CENTER;
  }, [location]);

  return (
    <div className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={mapCenter}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapRecenter center={mapCenter} />
        
        {parishes.map((parish) => (
          <Marker
            key={parish.id}
            position={[parish.lat, parish.lng]}
            icon={createCustomIcon(parish.status)}
          >
            <Popup className="parish-popup">
              <div className="min-w-[200px] max-w-[250px]">
                {/* Thumbnail */}
                {parish.imageUrl ? (
                  <img
                    src={parish.imageUrl}
                    alt={parish.name}
                    className="w-full h-24 object-cover rounded-t-lg -mt-3 -mx-3 mb-3"
                    style={{ width: "calc(100% + 24px)" }}
                  />
                ) : (
                  <div className="w-full h-24 bg-muted rounded-t-lg -mt-3 -mx-3 mb-3 flex items-center justify-center" style={{ width: "calc(100% + 24px)" }}>
                    <Church className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                
                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground text-sm leading-tight">
                    {parish.name}
                  </h3>
                  
                  {parish.nextEventTime && parish.nextEventType && (
                    <p className="text-xs text-muted-foreground">
                      {parish.nextEventType} hoje: <span className="font-medium text-foreground">{parish.nextEventTime}</span>
                    </p>
                  )}
                  
                  <Button
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => navigate(`/paroquia/${parish.id}`)}
                  >
                    Ver Perfil
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ParishMap;
