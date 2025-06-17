import { useRef, useEffect, useCallback, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from '@/components/ui/use-toast';
import { generatePopupHTML, attachPopupEventlisteners, removePopupEventListeners } from '@/components/map/MapPopup';
import { useNavigate } from 'react-router-dom';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoicHJvamVjdGJvc3MiLCJhIjoiY21idzgxenkyMG84ejJrczN3NTZlcjdiaCJ9.I08L8pReq4OYizeu1XCZNg';

export const useMapbox = (mapContainerRef, initialLng, initialLat, initialZoom, initialMapStyle, theme) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapState, setMapState] = useState({
    lng: initialLng,
    lat: initialLat,
    zoom: initialZoom,
    mapError: null,
    mapStyle: initialMapStyle,
    isLoaded: false,
  });
  const navigate = useNavigate();

  const clearMarkers = useCallback(() => {
    removePopupEventListeners();
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  }, []);

  const addMarkersToMap = useCallback((properties) => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded() || mapState.mapError) return;
    clearMarkers();

    properties.forEach(property => {
      if (property.latitude && property.longitude) {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url('https://storage.googleapis.com/hostinger-horizons-assets-prod/c4f7568c-f729-41c6-87f2-ac8c22ef8c3a/e8318999145048187940a3090a3a2995.png')`;
        el.style.width = `30px`;
        el.style.height = `30px`;
        el.style.backgroundSize = '100%';
        el.style.cursor = 'pointer';

        const popupContent = generatePopupHTML(property, navigate);
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat([property.longitude, property.latitude])
          .setPopup(new mapboxgl.Popup({ offset: 25, className: 'custom-mapbox-popup' }).setHTML(popupContent))
          .addTo(mapRef.current);
        markersRef.current.push(marker);
      }
    });
    attachPopupEventlisteners(navigate);
  }, [clearMarkers, mapState.mapError, navigate]);

  const setMapStyle = useCallback((newStyleUrl) => {
    setMapState(prev => ({ ...prev, mapError: null, mapStyle: newStyleUrl }));
  }, []);

  useEffect(() => {
    if (mapRef.current || mapState.mapError) return;
    if (!mapContainerRef.current) {
      setMapState(prev => ({ ...prev, mapError: "Map container not found in the DOM." }));
      return;
    }

    let mapInstance;
    try {
      mapInstance = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: mapState.mapStyle,
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom,
        attributionControl: false,
      });
      mapRef.current = mapInstance;

      mapInstance.on('load', () => {
        setMapState(prev => ({ ...prev, mapError: null, isLoaded: true }));
        if (mapRef.current) mapRef.current.resize();
      });

      mapInstance.on('error', (e) => {
        const errorMsg = e.error?.message || 'Unknown map error. Check console.';
        console.error('Mapbox GL JS error:', e.error || e);
        setMapState(prev => ({ ...prev, mapError: `Map Error: ${errorMsg}` }));
        toast({
          title: "Map Initialization Error",
          description: errorMsg,
          variant: "destructive",
          duration: 10000,
        });
      });

      mapInstance.on('move', () => {
        if (mapRef.current) {
          setMapState(prev => ({
            ...prev,
            lng: mapRef.current.getCenter().lng.toFixed(4),
            lat: mapRef.current.getCenter().lat.toFixed(4),
            zoom: mapRef.current.getZoom().toFixed(2),
          }));
        }
      });

      mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
      mapInstance.addControl(new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      }), 'top-right');
      mapInstance.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

    } catch (error) {
      console.error("Error initializing Mapbox GL JS:", error);
      setMapState(prev => ({ ...prev, mapError: "Failed to initialize the map. " + error.message }));
      toast({
        title: "Map Critical Error",
        description: "Failed to initialize map. " + error.message,
        variant: "destructive",
        duration: 10000,
      });
    }
    
    const currentMapContainer = mapContainerRef.current;
    const resizeObserver = new ResizeObserver(() => {
      if (mapRef.current && !mapState.mapError) {
        mapRef.current.resize();
      }
    });

    if (currentMapContainer) {
      resizeObserver.observe(currentMapContainer);
    }

    return () => {
      resizeObserver.disconnect();
      clearMarkers();
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (removeError) {
          console.warn("Error removing map on cleanup:", removeError);
        }
        mapRef.current = null;
      }
      setMapState(prev => ({ ...prev, isLoaded: false }));
    };
  }, [mapContainerRef, mapState.mapError]);

  useEffect(() => {
    if (mapRef.current && mapState.isLoaded && !mapState.mapError) {
      const currentStyleName = mapRef.current.getStyle().name;
      const targetStyleName = mapState.mapStyle;
      
      if (currentStyleName !== targetStyleName) {
        mapRef.current.setStyle(targetStyleName)
          .catch(err => {
             console.error("Failed to set map style:", err);
             setMapState(prev => ({...prev, mapError: "Failed to load new map style."}));
          });
      }
    }
  }, [mapState.mapStyle, mapState.isLoaded, mapState.mapError]);


  useEffect(() => {
    const popupStyleElement = document.getElementById('mapbox-popup-dynamic-style');
    if (popupStyleElement) popupStyleElement.remove();

    const styleEl = document.createElement('style');
    styleEl.id = 'mapbox-popup-dynamic-style';
    const cardBg = theme === 'dark' ? 'hsl(var(--popover))' : 'hsl(var(--card))';
    const cardFg = theme === 'dark' ? 'hsl(var(--popover-foreground))' : 'hsl(var(--card-foreground))';
    const borderCol = theme === 'dark' ? 'hsl(var(--border))' : 'hsl(var(--border))';
    
    styleEl.innerHTML = `
      .mapboxgl-popup-content.mapbox-popup-custom-styles {
        background-color: ${cardBg} !important;
        color: ${cardFg} !important;
        border: 1px solid ${borderCol} !important;
      }
      .mapboxgl-popup-tip {
        border-top-color: ${cardBg} !important; 
      }
      .custom-mapbox-popup .text-primary { color: hsl(var(--primary)) !important; }
      .custom-mapbox-popup .text-muted-foreground { color: hsl(var(--muted-foreground)) !important; }
      .custom-mapbox-popup .text-foreground { color: hsl(var(--foreground)) !important; }
      .custom-mapbox-popup .bg-primary { background-color: hsl(var(--primary)) !important; }
      .custom-mapbox-popup .text-primary-foreground { color: hsl(var(--primary-foreground)) !important; }
      .marker {
        background-size: contain;
        background-repeat: no-repeat;
        width: 30px;
        height: 30px;
        cursor: pointer;
        transition: transform 0.2s ease-out;
      }
      .marker:hover {
        transform: scale(1.2);
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      const existingStyle = document.getElementById('mapbox-popup-dynamic-style');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [theme]);

  return {
    mapRef,
    mapState,
    setMapStyle,
    addMarkersToMap,
    flyTo: (center, zoomLevel) => {
      if (mapRef.current && !mapState.mapError) {
        mapRef.current.flyTo({ center, zoom: zoomLevel, essential: true });
      }
    }
  };
};