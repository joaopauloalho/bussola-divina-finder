import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import { Church } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/useEvents";
import { useGeolocation, UserLocation } from "@/hooks/useGeolocation";

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

// SVG icons as strings for markers
const starIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const churchIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2"/><path d="M14 22v-4a2 2 0 0 0-4 0v4"/><path d="M18 22V5l-6-3-6 3v17"/><path d="M12 7v5"/><path d="M10 9h4"/></svg>`;
const navigationIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`;

// Create custom div icons for markers using inline HTML
const createCustomIcon = (status: "official" | "community" | "unverified") => {
  const isOfficial = status === "official";
  const bgColor = isOfficial ? "#fbbf24" : "#2563eb"; // amber-400 or primary blue
  const borderColor = isOfficial ? "#f59e0b" : "#1d4ed8"; // amber-500 or darker blue
  const iconColor = isOfficial ? "#92400e" : "#ffffff"; // amber-800 or white
  const pinTailColor = bgColor;
  
  const iconSvg = isOfficial ? starIconSvg : churchIconSvg;
  
  const iconHtml = `
    <div style="position: relative; width: 40px; height: 52px;">
      <div style="
        width: 40px;
        height: 40px;
        background-color: ${bgColor};
        border: 2px solid ${borderColor};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        color: ${iconColor};
      ">
        ${iconSvg}
      </div>
      <div style="
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 10px solid ${pinTailColor};
      "></div>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: "custom-parish-marker",
    iconSize: [40, 52],
    iconAnchor: [20, 52],
    popupAnchor: [0, -52],
  });
};

// Create user location icon using inline HTML with pulsing effect
const createUserLocationIcon = () => {
  const iconHtml = `
    <div style="position: relative; width: 48px; height: 48px;">
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 48px;
        height: 48px;
        background-color: rgba(59, 130, 246, 0.2);
        border-radius: 50%;
        animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      "></div>
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        background-color: #3b82f6;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      ">
        ${navigationIconSvg}
      </div>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: "user-location-marker",
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
};

// User location marker component - simplified without CircleMarker
const UserLocationMarker = ({ location }: { location: UserLocation }) => {
  const userIcon = useMemo(() => createUserLocationIcon(), []);
  
  return (
    <Marker
      position={[location.lat, location.lng]}
      icon={userIcon}
    >
      <Popup>
        <div className="text-center py-1">
          <p className="font-medium text-sm">Você está aqui</p>
        </div>
      </Popup>
    </Marker>
  );
};

const ParishMapContent = () => {
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
        
        {/* User location marker */}
        {location && <UserLocationMarker location={location} />}
        
        {/* Parish markers */}
        {parishes.map((parish) => {
          const icon = createCustomIcon(parish.status);
          return (
            <Marker
              key={parish.id}
              position={[parish.lat, parish.lng]}
              icon={icon}
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
          );
        })}
      </MapContainer>
    </div>
  );
};

export default ParishMapContent;
