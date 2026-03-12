'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl, { type LngLatLike, type Marker } from 'mapbox-gl';
import { Incident, MapMarker, ZoneOverlay } from '@/lib/types';
import { campusMarkers, campusZones } from '@/lib/mocks';
import { Badge } from '@/components/ui/badge';

interface PerimeterMapProps {
  incidents: Incident[];
  campus: string;
}

interface CampusConfig {
  lng: number;
  lat: number;
  zoom: number;
  bearing: number;
  pitch: number;
  lonSpan: number;
  latSpan: number;
  label: string;
  detail: string;
}

const CAMPUS_CONFIG: Record<string, CampusConfig> = {
  'Campus Metropolitano': { lng: -99.1332, lat: 19.4326, zoom: 15.4, bearing: -18, pitch: 52, lonSpan: 0.038, latSpan: 0.024, label: 'Escena Metro', detail: 'Trazado urbano denso y vigilancia perimetral.' },
  'Campus Tecnologico': { lng: -100.3161, lat: 25.6866, zoom: 15.1, bearing: 22, pitch: 58, lonSpan: 0.048, latSpan: 0.028, label: 'Escena Tec', detail: 'Bloques industriales, patios y corredores amplios.' },
  'Campus Tecnológico': { lng: -100.3161, lat: 25.6866, zoom: 15.1, bearing: 22, pitch: 58, lonSpan: 0.048, latSpan: 0.028, label: 'Escena Tec', detail: 'Bloques industriales, patios y corredores amplios.' },
  'Campus Oriente': { lng: -98.2063, lat: 19.0414, zoom: 15.6, bearing: -36, pitch: 48, lonSpan: 0.032, latSpan: 0.022, label: 'Escena Oriente', detail: 'Perimetro compacto con zonas verdes y accesos laterales.' },
  Global: { lng: -99.1332, lat: 19.4326, zoom: 11.5, bearing: 0, pitch: 0, lonSpan: 0.08, latSpan: 0.05, label: 'Vista General', detail: 'Resumen de cobertura intercampus.' },
};

const MARKER_ICON_BY_TYPE: Record<string, string> = {
  entrada: '/iconos/ICONOS-02.svg',
  salida: '/iconos/ICONOS-11.svg',
  falla: '/iconos/ICONOS-06.svg',
  estudiante: '/iconos/ICONOS-05.svg',
  incidente: '/iconos/Alerta.svg',
  cctv: '/iconos/ICONOS-10.svg',
  iluminacion: '/iconos/ICONOS-09.svg',
  edificio: '/iconos/logo-secundario.png',
  calle: '/iconos/ICONOS-03.svg',
  parking: '/iconos/ICONOS-12.svg',
  hospital: '/iconos/Hospital.svg',
  comercio: '/iconos/ICONOS-08.svg',
  parque: '/iconos/ICONOS-07.svg',
  policia: '/iconos/ICONOS-12.svg',
  farmacia: '/iconos/ICONOS-08.svg',
  cafeteria: '/iconos/ICONOS-07.svg',
};

function parsePercent(value: string): number {
  return Number(value.replace('%', ''));
}

function percentToLngLat(
  coords: { top: string; left: string },
  center: CampusConfig
): [number, number] {
  const x = (parsePercent(coords.left) - 50) / 100;
  const y = (50 - parsePercent(coords.top)) / 100;
  return [center.lng + x * center.lonSpan, center.lat + y * center.latSpan];
}

function zoneToPolygon(zone: ZoneOverlay, center: CampusConfig): [number, number][][] {
  const left = parsePercent(zone.coords.left);
  const top = parsePercent(zone.coords.top);
  const width = parsePercent(zone.coords.width);
  const height = parsePercent(zone.coords.height);

  const p1 = percentToLngLat({ top: `${top}%`, left: `${left}%` }, center);
  const p2 = percentToLngLat({ top: `${top}%`, left: `${left + width}%` }, center);
  const p3 = percentToLngLat({ top: `${top + height}%`, left: `${left + width}%` }, center);
  const p4 = percentToLngLat({ top: `${top + height}%`, left: `${left}%` }, center);

  return [[p1, p2, p3, p4, p1]];
}

function zoneFillColor(type: ZoneOverlay['type']): string {
  switch (type) {
    case 'danger-high':
      return '#C51617';
    case 'danger-mid':
      return '#E37909';
    case 'danger-low':
      return '#96939B';
    case 'safe':
      return '#FFFFFB';
    default:
      return '#96939B';
  }
}

export default function PerimeterMap({ incidents, campus }: PerimeterMapProps) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const dataMarkersRef = useRef<Marker[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);

  const campusConfig = useMemo(
    () => CAMPUS_CONFIG[campus] ?? CAMPUS_CONFIG['Campus Metropolitano'],
    [campus]
  );

  const activeIncidents = useMemo(
    () =>
      incidents.filter(
        (incident) =>
          incident.status === 'pendiente' && (campus === 'Global' ? true : incident.campus === campus)
      ),
    [incidents, campus]
  );

  const zones = useMemo(() => campusZones[campus] || [], [campus]);
  const markers = useMemo(() => campusMarkers[campus] || [], [campus]);

  useEffect(() => {
    if (!token || !mapContainerRef.current || mapRef.current) {
      return;
    }

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [campusConfig.lng, campusConfig.lat] as LngLatLike,
      zoom: campusConfig.zoom,
      pitch: campusConfig.pitch,
      bearing: campusConfig.bearing,
      antialias: true,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('load', () => {
      setIsMapReady(true);
    });

    mapRef.current = map;

    return () => {
      dataMarkersRef.current.forEach((marker) => marker.remove());
      dataMarkersRef.current = [];
      map.remove();
      mapRef.current = null;
      setIsMapReady(false);
    };
  }, [token, campusConfig]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapReady) {
      return;
    }

    map.flyTo({
      center: [campusConfig.lng, campusConfig.lat],
      zoom: campusConfig.zoom,
      pitch: campusConfig.pitch,
      bearing: campusConfig.bearing,
      duration: 800,
      essential: true,
    });

    const pathCoordinates = markers.slice(0, 6).map((marker) => percentToLngLat(marker.coords, campusConfig));
    const routeData = {
      type: 'FeatureCollection' as const,
      features: pathCoordinates.length >= 2 ? [{
        type: 'Feature' as const,
        geometry: {
          type: 'LineString' as const,
          coordinates: pathCoordinates,
        },
        properties: {},
      }] : [],
    };

    const zoneFeatures = zones.map((zone) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Polygon' as const,
        coordinates: zoneToPolygon(zone, campusConfig),
      },
      properties: {
        id: zone.id,
        name: zone.name,
        fill: zoneFillColor(zone.type),
      },
    }));

    const zoneData = {
      type: 'FeatureCollection' as const,
      features: zoneFeatures,
    };

    const existingSource = map.getSource('campus-zones') as mapboxgl.GeoJSONSource | undefined;
    if (existingSource) {
      existingSource.setData(zoneData);
    } else {
      map.addSource('campus-zones', {
        type: 'geojson',
        data: zoneData,
      });

      map.addLayer({
        id: 'campus-zones-fill',
        type: 'fill',
        source: 'campus-zones',
        paint: {
          'fill-color': ['get', 'fill'],
          'fill-opacity': 0.2,
        },
      });

      map.addLayer({
        id: 'campus-zones-outline',
        type: 'line',
        source: 'campus-zones',
        paint: {
          'line-color': '#E37909',
          'line-width': 2,
        },
      });
    }

    const existingRouteSource = map.getSource('campus-route') as mapboxgl.GeoJSONSource | undefined;
    if (existingRouteSource) {
      existingRouteSource.setData(routeData);
    } else {
      map.addSource('campus-route', {
        type: 'geojson',
        data: routeData,
      });

      map.addLayer({
        id: 'campus-route-line',
        type: 'line',
        source: 'campus-route',
        paint: {
          'line-color': '#E37909',
          'line-width': 4,
          'line-opacity': 0.7,
          'line-dasharray': [2, 2],
        },
      });
    }

    dataMarkersRef.current.forEach((marker) => marker.remove());
    dataMarkersRef.current = [];

    markers.forEach((marker) => {
      const [lng, lat] = percentToLngLat(marker.coords, campusConfig);
      const icon = MARKER_ICON_BY_TYPE[marker.type] || '/iconos/ICONOS-08.svg';

      const el = document.createElement('button');
      el.type = 'button';
      el.style.width = '36px';
      el.style.height = '36px';
      el.style.borderRadius = '999px';
      el.style.border = '2px solid #FFFFFB';
      el.style.background = '#E37909';
      el.style.boxShadow = '0 8px 18px rgba(0,0,0,0.25)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.padding = '6px';
      el.innerHTML = `<img src="${icon}" alt="${marker.label}" style="width:100%;height:100%;object-fit:contain;" />`;

      const popup = new mapboxgl.Popup({ offset: 12 }).setHTML(
        `<div style="font-family:Segoe UI Variable,Segoe UI,sans-serif;min-width:180px;">
          <strong style="display:block;color:#C51617;font-size:12px;text-transform:uppercase;">${marker.label}</strong>
          <span style="color:#96939B;font-size:11px;text-transform:uppercase;">Tipo: ${marker.type}</span>
        </div>`
      );

      const mapMarker = new mapboxgl.Marker(el).setLngLat([lng, lat]).setPopup(popup).addTo(map);
      dataMarkersRef.current.push(mapMarker);
    });

    activeIncidents.forEach((incident) => {
      const [lng, lat] = percentToLngLat(incident.coords, campusConfig);

      const el = document.createElement('button');
      el.type = 'button';
      el.style.width = '44px';
      el.style.height = '44px';
      el.style.borderRadius = '999px';
      el.style.border = '2px solid #FFFFFB';
      el.style.background = '#C51617';
      el.style.boxShadow = '0 0 0 10px rgba(197,22,23,0.2)';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.padding = '8px';
      el.innerHTML = '<img src="/iconos/Alerta.svg" alt="Alerta" style="width:100%;height:100%;object-fit:contain;" />';

      const popup = new mapboxgl.Popup({ offset: 12 }).setHTML(
        `<div style="font-family:Segoe UI Variable,Segoe UI,sans-serif;min-width:220px;">
          <strong style="display:block;color:#C51617;font-size:12px;text-transform:uppercase;">${incident.category}</strong>
          <p style="margin:6px 0;color:#4F4F4D;font-size:12px;line-height:1.35;">${incident.description}</p>
          <div style="display:flex;justify-content:space-between;color:#96939B;font-size:11px;text-transform:uppercase;">
            <span>${incident.zone}</span>
            <span>${incident.time}</span>
          </div>
        </div>`
      );

      const mapMarker = new mapboxgl.Marker(el).setLngLat([lng, lat]).setPopup(popup).addTo(map);
      dataMarkersRef.current.push(mapMarker);
    });
  }, [isMapReady, campusConfig, zones, markers, activeIncidents]);

  if (!token) {
    return (
      <div className="h-full flex flex-col space-y-4">
        <div>
          <h3 className="text-xl font-black text-primary font-headline uppercase tracking-tight">Mapa de Entorno Urbano</h3>
          <p className="text-sm text-muted-foreground font-medium">Configura Mapbox para habilitar el mapa en tiempo real.</p>
        </div>
        <div className="flex-1 min-h-[480px] rounded-[2rem] panel-soft p-6 flex flex-col justify-center items-center text-center">
          <p className="text-primary font-black uppercase text-sm">Falta NEXT_PUBLIC_MAPBOX_TOKEN</p>
          <p className="text-muted mt-2 text-sm">Agrega tu token en .env.local y reinicia el servidor.</p>
          <code className="mt-4 px-3 py-2 rounded-lg bg-background border border-muted/40 text-xs text-foreground">
            NEXT_PUBLIC_MAPBOX_TOKEN=tu_token_aqui
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h3 className="text-xl font-black text-primary font-headline uppercase tracking-tight">Mapa de Entorno Urbano</h3>
          <p className="text-sm text-muted-foreground font-medium">Comunidad Alerta con visualizacion en Mapbox.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="brand-chip px-3 py-1 text-[10px] font-bold">Mapbox</Badge>
          <Badge variant="outline" className="brand-chip px-3 py-1 text-[10px] font-bold">Zonas Activas</Badge>
          <Badge variant="outline" className="brand-chip px-3 py-1 text-[10px] font-bold">Incidentes</Badge>
        </div>
      </div>

      <div className="flex-1 min-h-[650px] rounded-[2.5rem] border border-muted/35 shadow-2xl overflow-hidden panel-soft">
        <div className="relative h-full w-full">
          <div ref={mapContainerRef} className="h-full w-full" />
          <div className="absolute left-4 top-4 z-10 max-w-[260px] rounded-2xl bg-background/95 border border-muted/35 px-4 py-3 shadow-xl backdrop-blur-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-primary">{campusConfig.label}</p>
            <h4 className="mt-1 text-sm font-black uppercase text-foreground">{campus}</h4>
            <p className="mt-1 text-xs text-muted-foreground">{campusConfig.detail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
