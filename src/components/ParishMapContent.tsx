import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
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
function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, DEFAULT_ZOOM);
  }, [center, map]);
  
  return null;
}

// SVG icons as strings for markers
const starIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const churchIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2"/><path d="M14 22v-4a2 2 0 0 0-4 0v4"/><path d="M18 22V5l-6-3-6 3v17"/><path d="M12 7v5"/><path d="M10 9h4"/></svg>`;
const navigationIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`;
const churchPlaceholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: #9ca3af;"><path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2"/><path d="M14 22v-4a2 2 0 0 0-4 0v4"/><path d="M18 22V5l-6-3-6 3v17"/><path d="M12 7v5"/><path d="M10 9h4"/></svg>`;

// Create custom div icons for markers
function createCustomIcon(status: "official" | "community" | "unverified") {
  const isOfficial = status === "official";
  const bgColor = isOfficial ? "#fbbf24" : "#2563eb";
  const borderColor = isOfficial ? "#f59e0b" : "#1d4ed8";
  const iconColor = isOfficial ? "#92400e" : "#ffffff";
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
}

// Create user location icon
function createUserLocationIcon() {
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
}

// Memoized icons
const userLocationIcon = createUserLocationIcon();

// Popup content component - uses plain HTML to avoid React context issues
function ParishPopupContent({ parish, onNavigate }: { parish: ParishMarker; onNavigate: () => void }) {
  return (
    <div className="parish-popup-content" style={{ minWidth: 200, maxWidth: 250 }}>
      {parish.imageUrl ? (
        <img
          src={parish.imageUrl}
          alt={parish.name}
          style={{ 
            width: "calc(100% + 24px)", 
            height: 96, 
            objectFit: "cover",
            borderRadius: "8px 8px 0 0",
            margin: "-12px -12px 12px -12px"
          }}
        />
      ) : (
        <div 
          style={{ 
            width: "calc(100% + 24px)", 
            height: 96,
            backgroundColor: "#f3f4f6",
            borderRadius: "8px 8px 0 0",
            margin: "-12px -12px 12px -12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          dangerouslySetInnerHTML={{ __html: churchPlaceholderSvg }}
        />
      )}
      
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h3 style={{ 
          fontWeight: 600, 
          fontSize: 14, 
          lineHeight: 1.25,
          margin: 0,
          color: "#1f2937"
        }}>
          {parish.name}
        </h3>
        
        {parish.nextEventTime && parish.nextEventType && (
          <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
            {parish.nextEventType} hoje: <span style={{ fontWeight: 500, color: "#1f2937" }}>{parish.nextEventTime}</span>
          </p>
        )}
        
        <button
          onClick={onNavigate}
          style={{
            width: "100%",
            marginTop: 8,
            padding: "8px 16px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
        >
          Ver Perfil
        </button>
      </div>
    </div>
  );
}

function ParishMapContent() {
  const navigate = useNavigate();
  const { location } = useGeolocation();
  const { data: events } = useEvents(location);
  const [isMapReady, setIsMapReady] = useState(false);

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

  // Determine map center
  const mapCenter = useMemo<[number, number]>(() => {
    if (location) {
      return [location.lat, location.lng];
    }
    return LONDRINA_CENTER;
  }, [location]);

  // Create parish icons
  const parishIcons = useMemo(() => {
    const icons: Record<string, L.DivIcon> = {};
    parishes.forEach((parish) => {
      icons[parish.id] = createCustomIcon(parish.status);
    });
    return icons;
  }, [parishes]);

  return (
    <div className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={mapCenter}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        whenReady={() => setIsMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MapRecenter center={mapCenter} />
        
        {/* User location marker */}
        {isMapReady && location && (
          <Marker position={[location.lat, location.lng]} icon={userLocationIcon}>
            <Popup>
              <p style={{ textAlign: "center", fontWeight: 500, fontSize: 14, margin: 0, padding: 4 }}>
                Você está aqui
              </p>
            </Popup>
          </Marker>
        )}
        
        {/* Parish markers */}
        {isMapReady && parishes.map((parish) => (
          <Marker
            key={parish.id}
            position={[parish.lat, parish.lng]}
            icon={parishIcons[parish.id]}
          >
            <Popup>
              <ParishPopupContent 
                parish={parish} 
                onNavigate={() => navigate(`/paroquia/${parish.id}`)} 
              />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default ParishMapContent;
