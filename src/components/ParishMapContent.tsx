import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
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

// SVG icons as strings for markers
const starIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const churchIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2"/><path d="M14 22v-4a2 2 0 0 0-4 0v4"/><path d="M18 22V5l-6-3-6 3v17"/><path d="M12 7v5"/><path d="M10 9h4"/></svg>`;
const navigationIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`;
const churchPlaceholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5"><path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2"/><path d="M14 22v-4a2 2 0 0 0-4 0v4"/><path d="M18 22V5l-6-3-6 3v17"/><path d="M12 7v5"/><path d="M10 9h4"/></svg>`;

// Create custom div icons for markers
function createCustomIcon(status: "official" | "community" | "unverified"): L.DivIcon {
  const isOfficial = status === "official";
  const bgColor = isOfficial ? "#fbbf24" : "#2563eb";
  const borderColor = isOfficial ? "#f59e0b" : "#1d4ed8";
  const iconColor = isOfficial ? "#92400e" : "#ffffff";
  const iconSvg = isOfficial ? starIconSvg : churchIconSvg;
  
  return L.divIcon({
    html: `
      <div style="position: relative; width: 40px; height: 52px;">
        <div style="width: 40px; height: 40px; background-color: ${bgColor}; border: 2px solid ${borderColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); color: ${iconColor};">
          ${iconSvg}
        </div>
        <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 10px solid ${bgColor};"></div>
      </div>
    `,
    className: "custom-parish-marker",
    iconSize: [40, 52],
    iconAnchor: [20, 52],
    popupAnchor: [0, -52],
  });
}

// Create user location icon
const userLocationIcon = L.divIcon({
  html: `
    <div style="position: relative; width: 48px; height: 48px;">
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 48px; height: 48px; background-color: rgba(59, 130, 246, 0.2); border-radius: 50%; animation: pulse-ring 2s ease-in-out infinite;"></div>
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; background-color: #3b82f6; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
        ${navigationIconSvg}
      </div>
    </div>
  `,
  className: "user-location-marker",
  iconSize: [48, 48],
  iconAnchor: [24, 24],
});

// Component to recenter map
function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, DEFAULT_ZOOM);
  }, [center, map]);
  
  return null;
}

function ParishMapContent() {
  const navigate = useNavigate();
  const { location } = useGeolocation();
  const { data: events } = useEvents(location);
  const [mapReady, setMapReady] = useState(false);

  // Group events by parish
  const parishes = useMemo<ParishMarker[]>(() => {
    if (!events) return [];

    const parishMap = new Map<string, ParishMarker>();
    const today = new Date().getDay();

    events.forEach((event) => {
      if (!parishMap.has(event.parish.id)) {
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

  // Map center
  const mapCenter = useMemo<[number, number]>(() => {
    if (location) return [location.lat, location.lng];
    return LONDRINA_CENTER;
  }, [location]);

  // Pre-create icons
  const parishIcons = useMemo(() => {
    const icons: Record<string, L.DivIcon> = {};
    parishes.forEach((p) => {
      icons[p.id] = createCustomIcon(p.status);
    });
    return icons;
  }, [parishes]);

  const handleNavigate = (parishId: string) => {
    navigate(`/paroquia/${parishId}`);
  };

  return (
    <div className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={mapCenter}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapRecenter center={mapCenter} />
        
        {/* User location marker */}
        {mapReady && location && (
          <Marker position={[location.lat, location.lng]} icon={userLocationIcon}>
            <Popup>
              <span style={{ fontWeight: 500 }}>Você está aqui</span>
            </Popup>
          </Marker>
        )}
        
        {/* Parish markers */}
        {mapReady && parishes.map((parish) => (
          <Marker
            key={parish.id}
            position={[parish.lat, parish.lng]}
            icon={parishIcons[parish.id]}
          >
            <Popup>
              <div style={{ minWidth: 200, maxWidth: 250 }}>
                {parish.imageUrl ? (
                  <img
                    src={parish.imageUrl}
                    alt={parish.name}
                    style={{ 
                      width: "calc(100% + 40px)", 
                      height: 96, 
                      objectFit: "cover",
                      borderRadius: "4px 4px 0 0",
                      margin: "-14px -20px 12px -20px"
                    }}
                  />
                ) : (
                  <div 
                    style={{ 
                      width: "calc(100% + 40px)", 
                      height: 96,
                      backgroundColor: "#f3f4f6",
                      borderRadius: "4px 4px 0 0",
                      margin: "-14px -20px 12px -20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    dangerouslySetInnerHTML={{ __html: churchPlaceholderSvg }}
                  />
                )}
                
                <h3 style={{ fontWeight: 600, fontSize: 14, margin: "0 0 8px 0", color: "#1f2937" }}>
                  {parish.name}
                </h3>
                
                {parish.nextEventTime && parish.nextEventType && (
                  <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 8px 0" }}>
                    {parish.nextEventType} hoje: <strong style={{ color: "#1f2937" }}>{parish.nextEventTime}</strong>
                  </p>
                )}
                
                <button
                  onClick={() => handleNavigate(parish.id)}
                  style={{
                    width: "100%",
                    padding: "8px 16px",
                    backgroundColor: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer"
                  }}
                >
                  Ver Perfil
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default ParishMapContent;
