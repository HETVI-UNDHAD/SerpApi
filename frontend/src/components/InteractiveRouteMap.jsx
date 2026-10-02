import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTrip } from '../context/TripContext';
import { loadGoogleMaps } from '../utils/loadGoogleMaps';
import {
  MapPin,
  Navigation,
  Sparkles,
  Car,
  Compass,
  Route,
  Plane,
  Building,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';

const DAY_COLORS = ['#06b6d4', '#f59e0b', '#a855f7', '#10b981', '#ec4899'];
const PIN_COLORS = ['#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#8b5cf6'];

const CITY_COORDINATES = {
  rajkot: { lat: 22.3039, lng: 70.8022 },
  junagadh: { lat: 21.5222, lng: 70.4579 },
  junagtah: { lat: 21.5222, lng: 70.4579 },
  jetpur: { lat: 21.7583, lng: 70.6276 },
  somnath: { lat: 20.8880, lng: 70.4012 },
  dwarka: { lat: 22.2442, lng: 68.9685 },
  sasangir: { lat: 21.1243, lng: 70.8242 },
  gir: { lat: 21.1243, lng: 70.8242 },
  morbi: { lat: 22.8173, lng: 70.8378 },
  gondal: { lat: 21.9619, lng: 70.7923 },
  jamnagar: { lat: 22.4707, lng: 70.0577 },
  bhavnagar: { lat: 21.7645, lng: 72.1519 },
  surat: { lat: 21.1702, lng: 72.8311 },
  vadodara: { lat: 22.3072, lng: 73.1812 },
  udaipur: { lat: 24.5854, lng: 73.7125 },
  goa: { lat: 15.4989, lng: 73.8278 },
  panaji: { lat: 15.4909, lng: 73.8278 },
  madgaon: { lat: 15.2736, lng: 73.9749 },
  margao: { lat: 15.2736, lng: 73.9749 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  delhi: { lat: 28.6139, lng: 77.2090 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  kerala: { lat: 9.9312, lng: 76.2673 },
  kochi: { lat: 9.9312, lng: 76.2673 },
  munnar: { lat: 10.0889, lng: 77.0595 },
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

export function sanitizeLatLng(raw, fallbackLat = 15.4989, fallbackLng = 73.8278) {
  if (!raw) return [fallbackLat, fallbackLng];
  let lat = raw.latitude ?? raw.lat ?? (Array.isArray(raw) ? raw[0] : null);
  let lng = raw.longitude ?? raw.lng ?? (Array.isArray(raw) ? raw[1] : null);
  lat = Number(lat);
  lng = Number(lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0)) {
    return [fallbackLat, fallbackLng];
  }
  // Check if coordinates were inadvertently swapped ([lng, lat] instead of [lat, lng])
  if (lat > 50 && lng < 40 && lng >= 6 && lat <= 98) {
    const temp = lat;
    lat = lng;
    lng = temp;
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return [fallbackLat, fallbackLng];
  }
  return [lat, lng];
}

function getCityCenter(cityName, locationObj = null) {
  if (locationObj?.latitude && locationObj?.longitude) {
    const [lat, lng] = sanitizeLatLng(locationObj);
    return { lat, lng };
  }
  if (locationObj?.lat && locationObj?.lng) {
    const [lat, lng] = sanitizeLatLng(locationObj);
    return { lat, lng };
  }
  if (!cityName) return { lat: 15.4989, lng: 73.8278 };
  const clean = cityName.toLowerCase().replace(/[^a-z]/g, '');
  for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
    if (clean.includes(city) || city.includes(clean)) return coords;
  }
  return { lat: 15.4989, lng: 73.8278 };
}

export default function InteractiveRouteMap({
  dayData,
  hotel,
  destination,
  transportation,
  activeFocusWaypoint = null
}) {
  const { currentTrip, selectedDay, setSelectedDay, theme } = useTrip();
  const isDark = theme === 'dark';

  const mapDivRef = useRef(null);
  const [engine, setEngine] = useState('detecting');
  const [viewMode, setViewMode] = useState('day'); // 'day' | 'full' | 'intercity'

  // Leaflet refs
  const lMapRef = useRef(null);
  const lTileLayerRef = useRef(null);
  const lLayerRef = useRef(null);

  const cityCenter = getCityCenter(destination || currentTrip?.destination, currentTrip?.destinationLocation);
  const originCityCenter = getCityCenter(currentTrip?.origin || 'Ahmedabad', currentTrip?.originLocation);

  const [hotelLat, hotelLng] = sanitizeLatLng(
    hotel?.gpsCoordinates || hotel?.coordinates,
    cityCenter.lat,
    cityCenter.lng
  );
  const hotelName = hotel?.name || 'Hotel Basecamp';

  const allItineraryDays = currentTrip?.itinerary || [];
  const currentDay = dayData || allItineraryDays.find(d => d.day === selectedDay) || allItineraryDays[0];

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
      }).setView([hotelLat, hotelLng], 12);

      const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      lMapRef.current = map;
      lTileLayerRef.current = tileLayer;
      lLayerRef.current = L.layerGroup().addTo(map);
    }

    renderRoute();
  }, [engine, viewMode, currentDay, hotel, destination, isDark, transportation, allItineraryDays]);

  // Handle external focus triggers
  useEffect(() => {
    if (activeFocusWaypoint != null) {
      focusWaypoint(activeFocusWaypoint);
    }
  }, [activeFocusWaypoint]);

  function renderRoute() {
    const map = lMapRef.current;
    const layer = lLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    const hotelPos = [hotelLat, hotelLng];
    const allBoundPoints = [hotelPos];

    // ── INTERCITY JOURNEY OVERVIEW (Origin -> Destination) ──
    if (viewMode === 'intercity') {
      const [originLat, originLng] = sanitizeLatLng(originCityCenter, 23.0225, 72.5714);
      const originPos = [originLat, originLng];
      const destPos = [hotelLat, hotelLng];

      allBoundPoints.push(originPos);
      allBoundPoints.push(destPos);

      // Origin Marker
      const originIcon = L.divIcon({
        className: 'origin-icon',
        html: `
          <div style="background:#0284c7;color:white;width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(2,132,199,0.65);border:3px solid #ffffff;font-size:18px;cursor:pointer;">
            🏠
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      L.marker(originPos, { icon: originIcon }).addTo(layer).bindPopup(`
        <div style="padding:6px;min-width:180px">
          <strong style="color:#0284c7;font-size:11px;text-transform:uppercase">Origin Point</strong>
          <p style="margin:2px 0;font-size:13px;font-weight:bold">${currentTrip?.origin || 'Ahmedabad'}</p>
          <span style="font-size:11px;color:#64748b">Trip Departure</span>
        </div>
      `);

      // Destination / Hotel Basecamp Marker
      const destIcon = L.divIcon({
        className: 'dest-icon',
        html: `
          <div style="background:#4f46e5;color:white;width:42px;height:42px;border-radius:14px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(79,70,229,0.65);border:3px solid #ffffff;font-size:20px;cursor:pointer;">
            🏨
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 21]
      });

      L.marker(destPos, { icon: destIcon }).addTo(layer).bindPopup(`
        <div style="padding:6px;min-width:200px">
          <strong style="color:#4f46e5;font-size:11px;text-transform:uppercase">Destination Anchor</strong>
          <p style="margin:2px 0;font-size:13px;font-weight:bold">${hotelName}</p>
          <span style="font-size:11px;color:#64748b">${destination || 'Goa'}</span>
        </div>
      `);

      // Inter-city Transit Route Corridor Line
      L.polyline([originPos, destPos], {
        color: '#06b6d4',
        weight: 4.5,
        opacity: 0.9,
        dashArray: '10, 10',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(layer);

      map.fitBounds(L.latLngBounds([originPos, destPos]), { padding: [50, 50], maxZoom: 10 });
      return;
    }

    // ── 1. HOTEL BASECAMP ANCHOR PIN ──
    const hotelIcon = L.divIcon({
      className: 'hotel-icon',
      html: `
        <div style="background:#4f46e5;color:white;width:42px;height:42px;border-radius:14px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(79,70,229,0.65);border:3px solid #ffffff;font-size:20px;cursor:pointer;">
          🏨
        </div>
      `,
      iconSize: [42, 42],
      iconAnchor: [21, 21]
    });

    const hotelMarker = L.marker(hotelPos, { icon: hotelIcon }).addTo(layer);
    hotelMarker.bindPopup(`
      <div style="padding:8px;min-width:220px">
        <strong style="color:#4f46e5;font-size:11px;text-transform:uppercase;letter-spacing:1px">🏨 Trip Geographic Anchor</strong>
        <p style="margin:4px 0 2px;font-size:14px;font-weight:bold;color:#0f172a">${hotelName}</p>
        <span style="font-size:11px;color:#64748b">${hotel?.address || destination || 'Goa'}</span>
        <div style="margin-top:6px;padding:4px 8px;background:#eef2ff;border-radius:8px;font-size:10px;font-weight:bold;color:#4338ca">
          All daily routes depart from & return to this stay
        </div>
      </div>
    `);

    // ── 2. VIEW MODE: FULL TRIP OVERVIEW ──
    if (viewMode === 'full') {
      allItineraryDays.forEach((day, dIdx) => {
        const dayColor = DAY_COLORS[dIdx % DAY_COLORS.length];
        const dayLatLngs = [hotelPos];
        const acts = day.activities || [];

        acts.forEach((act, aIdx) => {
          const offsetLat = (aIdx === 0 ? 0.012 : aIdx === 1 ? -0.015 : aIdx === 2 ? 0.022 : -0.018) + (dIdx * 0.008);
          const offsetLng = (aIdx === 0 ? 0.014 : aIdx === 1 ? -0.012 : aIdx === 2 ? -0.018 : 0.021) + (dIdx * 0.008);
          const [lat, lng] = sanitizeLatLng(
            act.placeDetails?.gpsCoordinates || act.gpsCoordinates,
            hotelLat + offsetLat,
            hotelLng + offsetLng
          );
          const pos = [lat, lng];
          dayLatLngs.push(pos);
          allBoundPoints.push(pos);

          const actIcon = L.divIcon({
            className: 'full-trip-icon',
            html: `
              <div style="background:${dayColor};color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:bold;border:2px solid #ffffff;box-shadow:0 4px 12px rgba(0,0,0,0.3);">
                D${day.day}
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });

          L.marker(pos, { icon: actIcon })
            .addTo(layer)
            .bindPopup(`<strong>Day ${day.day}: ${act.title}</strong><br/><span style="font-size:11px;color:#64748b">${act.category}</span>`);
        });

        // Close day loop back to hotel
        dayLatLngs.push(hotelPos);

        L.polyline(dayLatLngs, {
          color: dayColor,
          weight: 3.5,
          opacity: 0.85,
          dashArray: '6, 6',
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(layer);
      });

      if (allBoundPoints.length > 1) {
        map.fitBounds(L.latLngBounds(allBoundPoints), { padding: [40, 40], maxZoom: 13 });
      }
      return;
    }

    // ── 3. VIEW MODE: SINGLE DAY WITH REAL CORRIDORS ──
    const acts = currentDay?.activities || [];
    const dayLatLngs = [hotelPos];
    const isArrivalDay = currentDay?.day === 1;
    const isDepartureDay = currentDay?.day === allItineraryDays.length;

    // A. Airport / Station Inbound Transfer Marker on Day 1
    if (isArrivalDay) {
      const arrTransfer = currentDay?.destinationArrivalTransfer;
      const hubLat = hotelLat - 0.04;
      const hubLng = hotelLng - 0.035;
      const hubPos = [hubLat, hubLng];
      allBoundPoints.push(hubPos);

      const hubIcon = L.divIcon({
        className: 'hub-icon',
        html: `
          <div style="background:#0284c7;color:white;width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(2,132,199,0.5);border:2.5px solid #ffffff;font-size:18px;">
            ✈️
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      L.marker(hubPos, { icon: hubIcon })
        .addTo(layer)
        .bindPopup(`
          <div style="padding:6px;min-width:200px">
            <strong style="color:#0284c7;font-size:11px;text-transform:uppercase">✈️ Inbound Destination Transfer</strong>
            <p style="margin:3px 0;font-size:13px;font-weight:bold">${arrTransfer?.from || `${destination || 'Goa'} Airport`}</p>
            <span style="font-size:11px;color:#475569">Touchdown → Cab to Hotel Basecamp</span>
            <div style="font-size:11px;color:#0369a1;font-weight:bold;margin-top:4px">
              🚗 ${arrTransfer?.roadDistanceKm || 28} km · ~${arrTransfer?.estimatedDriveMinutes || 42} min drive
            </div>
          </div>
        `);

      // Inbound Highway Transfer Path (Airport -> Hotel)
      L.polyline([hubPos, hotelPos], {
        color: '#0284c7',
        weight: 4.5,
        opacity: 0.9,
        dashArray: '10, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(layer);
    }

    // B. Activities stops for the active day
    acts.forEach((act, idx) => {
      const offsetLat = (idx === 0 ? 0.012 : idx === 1 ? -0.015 : idx === 2 ? 0.022 : -0.018);
      const offsetLng = (idx === 0 ? 0.014 : idx === 1 ? -0.012 : idx === 2 ? -0.018 : 0.021);
      const [lat, lng] = sanitizeLatLng(
        act.placeDetails?.gpsCoordinates || act.gpsCoordinates,
        hotelLat + offsetLat,
        hotelLng + offsetLng
      );
      const pos = [lat, lng];
      dayLatLngs.push(pos);
      allBoundPoints.push(pos);

      const pinColor = PIN_COLORS[idx % PIN_COLORS.length];
      const stopIcon = L.divIcon({
        className: 'stop-icon',
        html: `
          <div style="background:linear-gradient(135deg, ${pinColor}, #3b82f6);color:white;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:13px;box-shadow:0 8px 20px rgba(0,0,0,0.45);border:2.5px solid #ffffff;cursor:pointer;">
            ${act.order || idx + 1}
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker(pos, { icon: stopIcon }).addTo(layer);
      marker.bindPopup(`
        <div style="padding:8px;min-width:220px">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
            <span style="background:${pinColor};color:white;padding:2px 8px;border-radius:9999px;font-size:10px;font-weight:bold">Stop #${act.order || idx + 1}</span>
            <span style="font-size:10px;color:#64748b">${act.time}</span>
          </div>
          <strong style="color:#0f172a;font-size:13px;display:block;margin-bottom:2px">${act.title}</strong>
          <p style="font-size:11px;color:#475569;margin:0 0 4px">${act.placeDetails?.category || act.category}</p>
          <div style="padding:4px 6px;background:#f8fafc;border-radius:6px;font-size:10px;color:#0284c7;font-weight:bold;margin-top:4px">
            From Stay: ${act.distanceFromHotelKm || 8.2} km • ~${act.travelTimeFromHotelMin || 22} min
          </div>
        </div>
      `);
    });

    // Close loop back to Hotel Basecamp
    dayLatLngs.push(hotelPos);

    // C. Departure Outbound Transfer Path on Final Day
    if (isDepartureDay && allItineraryDays.length > 1) {
      const depTransfer = currentDay?.returnDepartureTransfer;
      const depHubPos = [hotelLat - 0.04, hotelLng - 0.035];
      allBoundPoints.push(depHubPos);

      // Return Transfer Path (Hotel -> Airport)
      L.polyline([hotelPos, depHubPos], {
        color: '#f59e0b',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(layer);
    }

    // Outer glow track for local loop
    L.polyline(dayLatLngs, {
      color: '#06b6d4',
      weight: 8,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(layer);

    // Inner crisp directional path
    L.polyline(dayLatLngs, {
      color: '#4f46e5',
      weight: 3.5,
      opacity: 0.95,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(layer);

    // Fit map bounds to encompass all points
    if (allBoundPoints.length > 0) {
      const bounds = L.latLngBounds(allBoundPoints);
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 14 });
    }
  }

  // Jump to specific stop on map
  function focusWaypoint(idx) {
    if (!lMapRef.current) return;
    const activities = currentDay?.activities || [];
    if (idx === -1) {
      lMapRef.current.flyTo([hotelLat, hotelLng], 15, { animate: true, duration: 0.8 });
    } else if (idx === -2) {
      // Airport transfer
      lMapRef.current.flyTo([hotelLat - 0.04, hotelLng - 0.035], 14, { animate: true, duration: 0.8 });
    } else if (activities[idx]) {
      const act = activities[idx];
      const offsetLat = (idx === 0 ? 0.012 : idx === 1 ? -0.015 : idx === 2 ? 0.022 : -0.018);
      const offsetLng = (idx === 0 ? 0.014 : idx === 1 ? -0.012 : idx === 2 ? -0.018 : 0.021);
      const [lat, lng] = sanitizeLatLng(
        act.placeDetails?.gpsCoordinates || act.gpsCoordinates,
        hotelLat + offsetLat,
        hotelLng + offsetLng
      );
      lMapRef.current.flyTo([lat, lng], 15, { animate: true, duration: 0.8 });
    }
  }

  function resetBounds() {
    if (!lMapRef.current) return;
    if (viewMode === 'intercity') {
      const [originLat, originLng] = sanitizeLatLng(originCityCenter, 23.0225, 72.5714);
      lMapRef.current.fitBounds(L.latLngBounds([[originLat, originLng], [hotelLat, hotelLng]]), { padding: [50, 50], maxZoom: 10 });
      return;
    }
    const activities = currentDay?.activities || [];
    const pts = [[hotelLat, hotelLng]];
    activities.forEach((act, idx) => {
      const offsetLat = (idx === 0 ? 0.012 : idx === 1 ? -0.015 : idx === 2 ? 0.022 : -0.018);
      const offsetLng = (idx === 0 ? 0.014 : idx === 1 ? -0.012 : idx === 2 ? -0.018 : 0.021);
      const [lat, lng] = sanitizeLatLng(
        act.placeDetails?.gpsCoordinates || act.gpsCoordinates,
        hotelLat + offsetLat,
        hotelLng + offsetLng
      );
      pts.push([lat, lng]);
    });
    lMapRef.current.fitBounds(L.latLngBounds(pts), { padding: [45, 45], maxZoom: 14 });
  }

  const distance = currentDay?.routeSummary?.totalRoadDistanceKm || currentDay?.totalDistanceKm || 14;
  const transitTime = currentDay?.routeSummary?.totalTravelTimeMinutes || currentDay?.totalTravelTimeMinutes || 35;

  return (
    <div className="space-y-3 font-sans">

      {/* ── DAY-TO-DAY ROUTE VIEW SELECTOR ── */}
      <div className={`p-1.5 rounded-2xl border flex items-center gap-1.5 overflow-x-auto shadow-sm ${
        isDark ? 'bg-[#111726] border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 px-2 whitespace-nowrap">
          ROUTE VIEW:
        </span>

        {allItineraryDays.map(d => {
          const isSelected = viewMode === 'day' && d.day === (currentDay?.day || 1);
          return (
            <button
              key={d.day}
              onClick={() => {
                setViewMode('day');
                setSelectedDay(d.day);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                  : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <span>Day {d.day}</span>
            </button>
          );
        })}

        <button
          onClick={() => setViewMode('full')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            viewMode === 'full'
              ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md'
              : isDark
              ? 'text-slate-300 hover:text-white hover:bg-slate-800'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Full Trip</span>
        </button>

        <button
          onClick={() => setViewMode('intercity')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            viewMode === 'intercity'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
              : isDark
              ? 'text-slate-300 hover:text-white hover:bg-slate-800'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white'
          }`}
          title="View Inter-city Corridor Map"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>{currentTrip?.origin || 'Origin'} → {destination || 'Destination'}</span>
        </button>
      </div>

      {/* ── MAP CONTAINER ── */}
      <div className={`relative w-full h-[470px] rounded-3xl overflow-hidden border shadow-2xl transition-colors duration-400 ${
        isDark ? 'border-slate-800 bg-[#0B0F19]' : 'border-slate-200 bg-slate-100'
      }`}>
        <div ref={mapDivRef} className="w-full h-full z-0" />

        {/* Top Header Overlay with Destination & Engine */}
        <div className={`absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-xl border shadow-xl flex items-center gap-2 ${
          isDark ? 'bg-[#111726]/90 border-slate-800 text-white' : 'bg-white/90 border-slate-200 text-slate-900'
        }`}>
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-black tracking-wide">
            {viewMode === 'intercity'
              ? `${currentTrip?.origin || 'Ahmedabad'} → ${destination || 'Goa'} Corridor`
              : viewMode === 'full'
              ? `Full Journey Map (${destination || 'Goa'})`
              : currentDay?.title || 'Interactive Route Map'}
          </span>
          <span className="text-[10px] font-bold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            {engine === 'google' ? 'Google Maps' : 'Live Road Route Map'}
          </span>
        </div>

        {/* Top Right Recenter & Commute Stats */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            onClick={resetBounds}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold shadow-lg transition-all flex items-center gap-1.5 ${
              isDark ? 'bg-[#111726]/90 border-slate-800 text-cyan-400 hover:text-white hover:bg-slate-800' : 'bg-white/90 border-slate-200 text-indigo-600 hover:bg-slate-50'
            }`}
            title="Recenter route loop"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Recenter</span>
          </button>

          <div className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold shadow-lg flex items-center gap-2 ${
            isDark ? 'bg-[#111726]/90 border-slate-800 text-slate-200' : 'bg-white/90 border-slate-200 text-slate-800'
          }`}>
            <span className="text-cyan-400 font-extrabold">{distance} km road</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-extrabold">{transitTime}m drive</span>
          </div>
        </div>

        {/* ── MAP LEGEND OVERLAY ── */}
        <div className={`absolute bottom-4 left-4 z-10 p-2.5 rounded-2xl border shadow-xl flex items-center gap-3 text-[10px] font-bold backdrop-blur-md ${
          isDark ? 'bg-[#0B0F19]/90 border-slate-800 text-slate-300' : 'bg-white/90 border-slate-200 text-slate-700'
        }`}>
          {viewMode === 'intercity' ? (
            <>
              <span className="flex items-center gap-1">
                <span>🏠</span>
                <span>{currentTrip?.origin || 'Origin'}</span>
              </span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-1">
                <span>🏨</span>
                <span>{destination || 'Destination'} Basecamp</span>
              </span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-1 text-cyan-400">
                <span>━ ━</span>
                <span>Inter-city Transit</span>
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1">
                <span>🏨</span>
                <span>Hotel Basecamp</span>
              </span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-1">
                <span>✈️</span>
                <span>Airport / Station</span>
              </span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Activities</span>
              </span>
              <span className="opacity-40">•</span>
              <span className="flex items-center gap-1 text-indigo-400">
                <span>━ ━</span>
                <span>Road Route</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* ── INTERACTIVE WAYPOINT & TRANSIT SEQUENCE RIBBON ── */}
      <div className={`p-3 rounded-2xl border text-xs overflow-x-auto flex items-center gap-2 shadow-sm ${
        isDark ? 'bg-[#111726] border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
      }`}>
        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-400 whitespace-nowrap pl-1">
          Route Flow:
        </span>

        {/* Airport Transfer button (if Day 1) */}
        {currentDay?.day === 1 && (
          <>
            <button
              onClick={() => focusWaypoint(-2)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold text-[11px] whitespace-nowrap transition-all ${
                isDark ? 'bg-sky-950/60 border-sky-800/80 text-sky-300 hover:bg-sky-900' : 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100'
              }`}
            >
              <span>✈️</span>
              <span>Airport Transfer</span>
            </button>
            <span className="text-slate-500 font-medium text-[10px]">→</span>
          </>
        )}

        {/* Basecamp button */}
        <button
          onClick={() => focusWaypoint(-1)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold text-[11px] whitespace-nowrap transition-all ${
            isDark ? 'bg-indigo-950/60 border-indigo-800/80 text-indigo-300 hover:bg-indigo-900' : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
          }`}
        >
          <span>🏨</span>
          <span>Stay Basecamp</span>
        </button>

        {/* Waypoints with transit connect */}
        {currentDay?.activities?.map((act, i) => {
          const tMin = act.transitToHere?.durationMinutes || act.travelTimeFromHotelMin || 15;
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
        <span className="text-slate-500 font-medium flex items-center gap-0.5 text-[10px] whitespace-nowrap">
          <span>🚗</span>
          <span>Return</span>
          <span>→</span>
        </span>

        <button
          onClick={() => focusWaypoint(-1)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border font-bold text-[11px] whitespace-nowrap transition-all ${
            isDark ? 'bg-indigo-950/60 border-indigo-800/80 text-indigo-300 hover:bg-indigo-900' : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
          }`}
        >
          <span>🏨</span>
          <span>Hotel Base</span>
        </button>
      </div>
    </div>
  );
}
