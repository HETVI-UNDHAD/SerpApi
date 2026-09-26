import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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

export default function InteractiveRouteMap({ dayData, hotel, destination, transportation }) {
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
        attributionControl: true
      }).setView([hotelLat, hotelLng], 13);

      const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      lMapRef.current = map;
      lTileLayerRef.current = tileLayer;
      lLayerRef.current = L.layerGroup().addTo(map);
    } else if (lTileLayerRef.current) {
      // OSM tiles are shared across themes; marker and route styling stays theme-aware.
    }

    renderLeafletRoute();
  }, [engine, dayData, hotel, destination, isDark, transportation]);

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

    // Always render the local city day route connecting Hotel -> Spot 1 -> Spot 2 -> ... -> Hotel
    const closedRoute = [...latLngs, hotelPos];

    // Outer glow track
    L.polyline(closedRoute, {
      color: '#06b6d4',
      weight: 8,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(layer);

    // Inner crisp directional path
    L.polyline(closedRoute, {
      color: '#4f46e5',
      weight: 3.5,
      opacity: 0.95,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(layer);

    // Fit map bounds to encompass the day's local itinerary
    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(closedRoute);
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 14 });
    }
  }

  const stopsCount = dayData?.activities?.length || 3;
  const distance = dayData?.totalDistanceKm || 14;
  const transitTime = dayData?.totalTravelTimeMinutes || 35;

  // Jump to specific stop on map
  function focusWaypoint(idx) {
    if (!lMapRef.current) return;
    const activities = dayData?.activities || [];
    if (idx === -1) {
      lMapRef.current.flyTo([hotelLat, hotelLng], 15, { animate: true, duration: 0.8 });
    } else if (activities[idx]) {
      const act = activities[idx];
      const offsetLat = (idx === 0 ? 0.012 : idx === 1 ? -0.015 : idx === 2 ? 0.022 : -0.018);
      const offsetLng = (idx === 0 ? 0.014 : idx === 1 ? -0.012 : idx === 2 ? -0.018 : 0.021);
      const lat = act.placeDetails?.gpsCoordinates?.latitude || (hotelLat + offsetLat);
      const lng = act.placeDetails?.gpsCoordinates?.longitude || (hotelLng + offsetLng);
      lMapRef.current.flyTo([lat, lng], 15, { animate: true, duration: 0.8 });
    }
  }

  function resetBounds() {
    if (!lMapRef.current) return;
    const activities = dayData?.activities || [];
    const pts = [[hotelLat, hotelLng]];
    activities.forEach((act, idx) => {
      const offsetLat = (idx === 0 ? 0.012 : idx === 1 ? -0.015 : idx === 2 ? 0.022 : -0.018);
      const offsetLng = (idx === 0 ? 0.014 : idx === 1 ? -0.012 : idx === 2 ? -0.018 : 0.021);
      pts.push([
        act.placeDetails?.gpsCoordinates?.latitude || (hotelLat + offsetLat),
        act.placeDetails?.gpsCoordinates?.longitude || (hotelLng + offsetLng)
      ]);
    });
    lMapRef.current.fitBounds(L.latLngBounds(pts), { padding: [45, 45], maxZoom: 14 });
  }

  return (
    <div className="space-y-3">
      <div className={`relative w-full h-[460px] rounded-3xl overflow-hidden border shadow-2xl transition-colors duration-400 ${
        isDark ? 'border-slate-800 bg-[#0B0F19]' : 'border-slate-200 bg-slate-100'
      }`}>
        <div ref={mapDivRef} className="w-full h-full z-0" />

        {/* Top Header Overlay with Destination & Engine */}
        <div className={`absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-xl border shadow-xl flex items-center gap-2 ${
          isDark ? 'bg-[#111726]/90 border-slate-800 text-white' : 'bg-white/90 border-slate-200 text-slate-900'
        }`}>
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-black tracking-wide">
            {dayData?.title || 'Interactive Route Map'}
          </span>
          <span className="text-[10px] font-bold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            {engine === 'google' ? 'Google Maps' : 'Live Route Map'}
          </span>
        </div>

        {/* Top Right Recenter & Commute Stats */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            onClick={resetBounds}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold shadow-lg transition-all flex items-center gap-1.5 ${
              isDark ? 'bg-[#111726]/90 border-slate-800 text-cyan-400 hover:text-white hover:bg-slate-800' : 'bg-white/90 border-slate-200 text-indigo-600 hover:bg-slate-50'
            }`}
            title="Recenter whole day route"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Recenter Loop</span>
          </button>

          <div className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold shadow-lg flex items-center gap-2 ${
            isDark ? 'bg-[#111726]/90 border-slate-800 text-slate-200' : 'bg-white/90 border-slate-200 text-slate-800'
          }`}>
            <span className="text-cyan-400 font-extrabold">{distance} km</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-extrabold">{transitTime}m commute</span>
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE WAYPOINT & TRANSIT SEQUENCE RIBBON ── */}
      <div className={`p-3 rounded-2xl border text-xs overflow-x-auto flex items-center gap-2 shadow-sm ${
        isDark ? 'bg-[#111726] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
      }`}>
        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 whitespace-nowrap pl-1">
          Route Flow:
        </span>

        {/* Basecamp button */}
        <button
          onClick={() => focusWaypoint(-1)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold text-[11px] whitespace-nowrap transition-all ${
            isDark ? 'bg-indigo-950/60 border-indigo-800/80 text-indigo-300 hover:bg-indigo-900' : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
          }`}
        >
          <span>🏨</span>
          <span>Basecamp</span>
        </button>

        {/* Waypoints with transit connect */}
        {dayData?.activities?.map((act, i) => {
          const tMin = act.transitToHere?.durationMinutes || 12;
          const tMode = act.transitToHere?.mode === 'walking' ? '🚶' : act.transitToHere?.mode === 'auto' ? '🛺' : '🚗';
          return (
            <React.Fragment key={act.id || i}>
              <span className="text-slate-500 font-medium flex items-center gap-0.5 text-[10px] whitespace-nowrap">
                <span>{tMode}</span>
                <span>{tMin}m</span>
                <span>→</span>
              </span>

              <button
                onClick={() => focusWaypoint(i)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold text-[11px] whitespace-nowrap transition-all ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-cyan-500 hover:text-cyan-400'
                    : 'bg-slate-100 border-slate-200 text-slate-800 hover:border-indigo-400 hover:text-indigo-600'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-cyan-500 text-white text-[9px] flex items-center justify-center font-black">
                  {act.order || i + 1}
                </span>
                <span className="max-w-[120px] truncate">{act.title}</span>
              </button>
            </React.Fragment>
          );
        })}

        {/* Return to Basecamp */}
        {dayData?.returnTransitToHotel && (
          <>
            <span className="text-slate-500 font-medium flex items-center gap-0.5 text-[10px] whitespace-nowrap">
              <span>🚗</span>
              <span>{dayData.returnTransitToHotel.durationMinutes || 15}m</span>
              <span>→</span>
            </span>

            <button
              onClick={() => focusWaypoint(-1)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold text-[11px] whitespace-nowrap transition-all ${
                isDark ? 'bg-indigo-950/60 border-indigo-800/80 text-indigo-300 hover:bg-indigo-900' : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              <span>🏨</span>
              <span>Return Base</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function decodePolyline(encoded) {
  const points = [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let byte;
    do { byte = encoded.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    result = 0; shift = 0;
    do { byte = encoded.charCodeAt(index++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}
