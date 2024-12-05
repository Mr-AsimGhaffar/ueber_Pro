"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  Marker,
  InfoWindow,
  LoadScript,
} from "@react-google-maps/api";
import { Button } from "antd";
import { MdLocationPin, MdOutlineNavigation, MdAdd } from "react-icons/md";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 33.6995,
  lng: 73.0363,
};

const mapOptions = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [{ color: "#000000" }],
    },
  ],
};

interface Location {
  id: string;
  place: string;
  lat: number;
  lng: number;
  type?: "start" | "end" | "waypoint";
}

interface MapProps {
  startLocation: Location | null;
  endLocation: Location | null;
  waypoints: Location[];
  onAddStart: () => void;
  onAddEnd: () => void;
  onAddWaypoint: () => void;
  onRemoveWaypoint: (id: string) => void;
  onRouteUpdate: (
    details: {
      distance: string;
      duration: string;
      steps: Array<{
        distance: string;
        duration: string;
        instructions: string;
      }>;
    } | null
  ) => void;
}

export default function Map({
  startLocation,
  endLocation,
  waypoints,
  onAddStart,
  onAddEnd,
  onAddWaypoint,
  onRemoveWaypoint,
  onRouteUpdate,
}: MapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
    null
  );
  const previousLocationsRef = useRef({
    startLocation,
    endLocation,
    waypoints,
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const formatDistance = (meters: number): string => {
    const miles = meters * 0.000621371;
    return `${miles.toFixed(1)} mi`;
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
  };

  const clearRoute = useCallback(() => {
    if (directionsRendererRef.current) {
      directionsRendererRef.current.setMap(null);
      directionsRendererRef.current = null;
    }
  }, []);

  const updateBounds = useCallback(() => {
    if (!mapRef.current) return;

    const bounds = new google.maps.LatLngBounds();
    let hasLocations = false;

    if (startLocation) {
      bounds.extend({ lat: startLocation.lat, lng: startLocation.lng });
      hasLocations = true;
    }
    if (endLocation) {
      bounds.extend({ lat: endLocation.lat, lng: endLocation.lng });
      hasLocations = true;
    }
    waypoints.forEach((waypoint) => {
      bounds.extend({ lat: waypoint.lat, lng: waypoint.lng });
      hasLocations = true;
    });

    if (hasLocations) {
      mapRef.current.fitBounds(bounds);
    } else {
      mapRef.current.setCenter(defaultCenter);
      mapRef.current.setZoom(12);
    }
  }, [startLocation, endLocation, waypoints]);

  const updateRoute = useCallback(async () => {
    if (!mapRef.current || !startLocation || !endLocation) {
      clearRoute();
      onRouteUpdate(null);
      return;
    }

    const directionsService = new google.maps.DirectionsService();

    const wayPointsFormatted = waypoints
      .filter((wp) => wp.lat !== 0 && wp.lng !== 0)
      .map((wp) => ({
        location: new google.maps.LatLng(wp.lat, wp.lng),
        stopover: true,
      }));

    try {
      const result = await directionsService.route({
        origin: new google.maps.LatLng(startLocation.lat, startLocation.lng),
        destination: new google.maps.LatLng(endLocation.lat, endLocation.lng),
        waypoints: wayPointsFormatted,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      clearRoute();

      const directionsRenderer = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#4F46E5",
          strokeWeight: 5,
        },
      });

      directionsRenderer.setMap(mapRef.current);
      directionsRenderer.setDirections(result);
      directionsRendererRef.current = directionsRenderer;

      const route = result.routes[0];
      const steps = route.legs.flatMap((leg) =>
        leg.steps.map((step) => ({
          distance: step.distance?.text || "",
          duration: step.duration?.text || "",
          instructions: step.instructions || "",
        }))
      );

      const totalDistance = route.legs.reduce(
        (total, leg) => total + (leg.distance?.value || 0),
        0
      );

      const totalDuration = route.legs.reduce(
        (total, leg) => total + (leg.duration?.value || 0),
        0
      );

      onRouteUpdate({
        distance: formatDistance(totalDistance),
        duration: formatDuration(totalDuration),
        steps,
      });

      if (result.routes[0].bounds) {
        mapRef.current.fitBounds(result.routes[0].bounds);
      }
    } catch (error) {
      console.error("Direction service failed:", error);
      clearRoute();
      onRouteUpdate(null);
    }
  }, [startLocation, endLocation, waypoints, clearRoute, onRouteUpdate]);

  // Check if locations have actually changed
  const hasLocationsChanged = useCallback(() => {
    const prev = previousLocationsRef.current;
    const current = { startLocation, endLocation, waypoints };

    const locationChanged = (a: Location | null, b: Location | null) => {
      if (!a && !b) return false;
      if (!a || !b) return true;
      return a.id !== b.id || a.lat !== b.lat || a.lng !== b.lng;
    };

    const waypointsChanged = (a: Location[], b: Location[]) => {
      if (a.length !== b.length) return true;
      return a.some(
        (waypoint, index) =>
          waypoint.id !== b[index].id ||
          waypoint.lat !== b[index].lat ||
          waypoint.lng !== b[index].lng
      );
    };

    return (
      locationChanged(prev.startLocation, current.startLocation) ||
      locationChanged(prev.endLocation, current.endLocation) ||
      waypointsChanged(prev.waypoints, current.waypoints)
    );
  }, [startLocation, endLocation, waypoints]);

  useEffect(() => {
    if (hasLocationsChanged()) {
      previousLocationsRef.current = { startLocation, endLocation, waypoints };
      const timeoutId = setTimeout(() => {
        updateRoute();
        updateBounds();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [
    startLocation,
    endLocation,
    waypoints,
    updateRoute,
    updateBounds,
    hasLocationsChanged,
  ]);

  useEffect(() => {
    return () => {
      clearRoute();
    };
  }, [clearRoute]);

  const createNumberedMarker = useCallback((number: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext("2d");
    if (context) {
      context.beginPath();
      context.arc(16, 16, 14, 0, 2 * Math.PI);
      context.fillStyle = "#4F46E5";
      context.fill();
      context.font = "bold 16px Arial";
      context.fillStyle = "#FFFFFF";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(number.toString(), 16, 16);
    }
    return canvas.toDataURL();
  }, []);

  const handleMarkerClick = useCallback((location: Location) => {
    setSelectedLocation(location);
  }, []);

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={defaultCenter}
        onLoad={onMapLoad}
        onClick={() => setSelectedLocation(null)}
        options={mapOptions}
      >
        {startLocation && (
          <Marker
            position={{ lat: startLocation.lat, lng: startLocation.lng }}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
              labelOrigin: new google.maps.Point(11, -10),
            }}
            label={{
              text: "Start",
              color: "#166534",
              fontSize: "14px",
              fontWeight: "bold",
            }}
            onClick={() => handleMarkerClick(startLocation)}
          />
        )}
        {waypoints.map((waypoint, index) => (
          <Marker
            key={index}
            position={{ lat: waypoint.lat, lng: waypoint.lng }}
            icon={{
              url: createNumberedMarker(index + 1),
              scaledSize: new google.maps.Size(32, 32),
              anchor: new google.maps.Point(16, 16),
            }}
            onClick={() => handleMarkerClick(waypoint)}
          />
        ))}
        {endLocation && (
          <Marker
            position={{ lat: endLocation.lat, lng: endLocation.lng }}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              labelOrigin: new google.maps.Point(11, -10),
            }}
            label={{
              text: "End",
              color: "#991B1B",
              fontSize: "14px",
              fontWeight: "bold",
            }}
            onClick={() => handleMarkerClick(endLocation)}
          />
        )}
        {selectedLocation && (
          <InfoWindow
            position={{
              lat: selectedLocation.lat,
              lng: selectedLocation.lng,
            }}
            onCloseClick={() => setSelectedLocation(null)}
          >
            <div className="p-2">
              <p className="font-medium mb-2">{selectedLocation.place}</p>
              {selectedLocation.type === "waypoint" && (
                <Button
                  type="primary"
                  danger
                  size="small"
                  onClick={() => {
                    onRemoveWaypoint(selectedLocation.id);
                    setSelectedLocation(null);
                  }}
                >
                  Remove Stop
                </Button>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {!startLocation && (
          <Button
            type="default"
            size="middle"
            icon={<MdLocationPin style={{ color: "green" }} />}
            onClick={onAddStart}
          >
            Set Start
          </Button>
        )}
        {!endLocation && (
          <Button
            type="default"
            size="middle"
            icon={<MdOutlineNavigation style={{ color: "red" }} />}
            onClick={onAddEnd}
          >
            Set End
          </Button>
        )}
        <Button
          type="default"
          size="middle"
          icon={<MdAdd style={{ color: "blue" }} />}
          onClick={onAddWaypoint}
        >
          Add Stop
        </Button>
      </div>
    </div>
  );
}
