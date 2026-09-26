import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useTrip } from '../context/TripContext';
import { loadGoogleMaps } from '../utils/loadGoogleMaps';
import { MapPin, Navigation, Sparkles, Car, Compass, Route } from 'lucide-react';

const PIN_COLORS = ['#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#8b5cf6'];

const CITY_COORDINATES = {
  udaipur: { lat: 24.5854, lng: 73.7125 },
  goa: { lat: 15.4989, lng: 73.8278 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  delhi: { lat: 28.6139, lng: 77.2090 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  kerala: { lat: 9.9312, lng: 76.2673 },
  kochi: { lat: 9.9312, lng: 76.2673 },
  manali: { lat: 32.2432, lng: 77.1892 },
  shimla: { lat: 31.1048, lng: 77.1734 },
  varanasi: { lat: 25.3176, lng: 82.9739 },
  agra: { lat: 27.1767, lng: 78.0081 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  pune: { lat: 18.5204, lng: 73.8567 },
  amritsar: { lat: 31.6340, lng: 74.8723 },
  chandigarh: { lat: 30.7333, lng: 76.7794 },
  paris: { lat: 48.8566, lng: 2.3522 },
  bali: { lat: -8.4095, lng: 115.1889 },
  switzerland: { lat: 46.8182, lng: 8.2275 }
};

function getCityCenter(destination) {
  if (!destination) return { lat: 24.5854, lng: 73.7125 };
  const clean = destination.toLowerCase().replace(/[^a-z]/g, '');
  for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
    if (clean.includes(city) || city.includes(clean)) return coords;
  }
  return { lat: 24.5854, lng: 73.7125 };
}

export default function InteractiveRouteMap({ dayData, hotel, destination }) {
  const { theme } = useTrip();
  const isDark = theme === 'dark';

  const mapDivRef = useRef(null);
  const [engine, setEngine] = useState('detecting');

  // Google Maps refs
  const gMapRef = useRef(null);
  const gMarkersRef = useRef([]);
  const gRendererRef = useRef(null);

  // Leaflet refs
  const lMapRef = useRef(null);
  const lTileLayerRef = useRef(null);
  const lLayerRef = useRef(null);

  const cityCenter = getCityCenter(destination);
  const hotelLat = hotel?.gpsCoordinates?.latitude || cityCenter.lat;
  const hotelLng = hotel?.gpsCoordinates?.longitude || cityCenter.lng;

  // 1. Detect if Google Maps API key is configured
  useEffect(() => {
    const hasKey = Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
    if (!hasKey) {
      setEngine('leaflet');
      return;
    }

    loadGoogleMaps()
      .then(() => setEngine('google'))
      .catch(() => setEngine('leaflet'));
  }, []);

  // 2. Initialize and render Leaflet Map
  useEffect(() => {
    if (engine !== 'leaflet' || !mapDivRef.current) return;

    if (!lMapRef.current) {
      const map = L.map(mapDivRef.current, {
        zoomControl: true,
        attributionControl: false
      }).setView([hotelLat, hotelLng], 13);

      const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      const tileLayer = L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

      lMapRef.current = map;
      lTileLayerRef.current = tileLayer;
      lLayerRef.current = L.layerGroup().addTo(map);
    } else if (lTileLayerRef.current) {
      // Update tile layer on theme toggle
      const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      lTileLayerRef.current.setUrl(tileUrl);
    }

    renderLeafletRoute();
  }, [engine, dayData, hotel, destination, isDark]);

  function renderLeafletRoute() {
    const map = lMapRef.current;
    const layer = lLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    const latLngs = [];
    const activities = dayData?.activities || [];

    // Hotel Basecamp marker with 3D pulsing styling
    const hotelPos = [hotelLat, hotelLng];
    latLngs.push(hotelPos);

    const hotelIcon = L.divIcon({
      className: 'hotel-icon',
      html: `
        <div style="background:#4f46e5;color:white;width:38px;height:38px;border-radius:14px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 18px rgba(79,70,229,0.55);border:2.5px solid #ffffff;font-size:18px;">
          🏨
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    const hotelMarker = L.marker(hotelPos, { icon: hotelIcon }).addTo(layer);
    hotelMarker.bindPopup(`
      <div style="padding:8px;min-width:200px">
        <strong style="color:#4f46e5;font-size:12px;text-transform:uppercase;letter-spacing:1px">🏨 Hotel Basecamp</strong>
        <p style="margin:4px 0 2px;font-size:13px;font-weight:bold;color:#0f172a">${hotel?.name || 'Selected Stay'}</p>
        <span style="font-size:11px;color:#64748b">${hotel?.address || destination}</span>
      </div>
    `);

    // Activities stops with glossy 3D numbered pins (1..N)
    activities.forEach((act, idx) => {
      const offsetLat = (idx === 0 ? 0.012 : idx === 1 ? -0.015 : idx === 2 ? 0.022 : -0.018);
      const offsetLng = (idx === 0 ? 0.014 : idx === 1 ? -0.012 : idx === 2 ? -0.018 : 0.021);

      const lat = act.placeDetails?.gpsCoordinates?.latitude || (hotelLat + offsetLat);
      const lng = act.placeDetails?.gpsCoordinates?.longitude || (hotelLng + offsetLng);
      const pos = [lat, lng];
      latLngs.push(pos);

      const pinColor = PIN_COLORS[idx % PIN_COLORS.length];
      const stopIcon = L.divIcon({
        className: 'stop-icon',
        html: `
          <div style="background:linear-gradient(135deg, ${pinColor}, #3b82f6);color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;box-shadow:0 8px 20px rgba(0,0,0,0.45);border:2.5px solid #ffffff;">
            ${act.order || idx + 1}
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker(pos, { icon: stopIcon }).addTo(layer);
      marker.bindPopup(`
        <div style="padding:8px;min-width:210px">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
            <span style="background:${pinColor};color:white;padding:2px 8px;border-radius:9999px;font-size:10px;font-weight:bold">Stop #${act.order || idx + 1}</span>
            <span style="font-size:10px;color:#64748b">${act.time}</span>
          </div>
          <strong style="color:#0f172a;font-size:13px;display:block;margin-bottom:2px">${act.title}</strong>
          <p style="font-size:11px;color:#475569;margin:0 0 4px">${act.placeDetails?.category || act.category}</p>
          <div style="font-size:10px;color:#0284c7;font-weight:bold">🚗 ${act.travelTimeFromPrev || '12 mins'}</div>
        </div>
      `);
    });

    // Draw glowing animated polyline route
    if (latLngs.length > 1) {
      const closedRoute = [...latLngs, hotelPos];
      // Outer glow
      L.polyline(closedRoute, {
        color: '#06b6d4',
        weight: 10,
        opacity: 0.25,
        lineCap: 'round'
      }).addTo(layer);

      // Inner crisp path
      L.polyline(closedRoute, {
        color: '#4f46e5',
        weight: 4,
        opacity: 0.9,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(layer);

      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [55, 55], maxZoom: 14 });
    }
  }

  const stopsCount = dayData?.activities?.length || 3;
  const distance = dayData?.totalDistanceKm || 14;
  const transitTime = dayData?.totalTravelTimeMinutes || 35;

  return (
    <div className={`relative w-full h-[480px] rounded-3xl overflow-hidden border shadow-2xl transition-colors duration-400 ${
      isDark ? 'border-white/10 bg-[#080A0F]' : 'border-slate-200 bg-slate-100'
    }`}>
      <div ref={mapDivRef} className="w-full h-full z-0" />

      {/* Top Header Overlay with Destination & Engine */}
      <div className={`absolute top-4 left-4 z-10 px-4 py-2 rounded-2xl backdrop-blur-xl border shadow-xl flex items-center gap-2.5 ${
        isDark ? 'bg-slate-900/85 border-white/15 text-white' : 'bg-white/90 border-slate-200 text-slate-900'
      }`}>
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-xs font-black tracking-wide">
          {dayData?.title || 'Interactive Route Map'}
        </span>
        <span className="text-[10px] font-bold text-cyan-500 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
          {engine === 'google' ? 'Google Maps' : 'Cinematic Map'}
        </span>
      </div>

      {/* ── FLOATING TRANSLUCENT MAP INFORMATION CARD ── */}
      <div className={`absolute top-4 right-4 z-10 px-4 py-2.5 rounded-2xl backdrop-blur-2xl border shadow-xl flex items-center gap-3 text-xs font-bold ${
        isDark
          ? 'glass-panel-dark border-white/15 text-white'
          : 'glass-panel-light border-slate-200/90 text-slate-900'
      }`}>
        <div className="flex items-center gap-1.5 text-cyan-400">
          <Route className="w-4 h-4" />
          <span>{distance} km</span>
        </div>
        <span className="opacity-30">•</span>
        <div className="flex items-center gap-1.5 text-violet-400">
          <Car className="w-4 h-4" />
          <span>{transitTime}m</span>
        </div>
        <span className="opacity-30">•</span>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <MapPin className="w-4 h-4" />
          <span>{stopsCount} stops</span>
        </div>
      </div>

      {/* Map Legend */}
      <div className={`absolute bottom-4 left-4 z-10 px-3.5 py-2 rounded-2xl backdrop-blur-xl border shadow-lg flex items-center gap-3 text-[11px] font-bold ${
        isDark ? 'bg-slate-900/85 border-white/10 text-slate-300' : 'bg-white/90 border-slate-200 text-slate-700'
      }`}>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-indigo-600 border border-white" />
          <span>Hotel Hub</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-cyan-500 border border-white" />
          <span>Waypoints 1..N</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-0.5 border-t-2 border-dashed border-cyan-400" />
          <span>Optimal Road Route</span>
        </div>
      </div>
    </div>
  );
}
