"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button, Card } from "antd";
import {
  FaMapMarkerAlt,
  FaArrowRight,
  FaClock,
  FaTimes,
  FaGripLines,
} from "react-icons/fa";
import LocationSearchInput from "./locationSearchInput";

const Map = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
});

interface Location {
  id: string;
  place: string;
  lat: number;
  lng: number;
  type: "start" | "end" | "waypoint";
}

interface RouteDetails {
  distance: string;
  duration: string;
  steps: Array<{
    distance: string;
    duration: string;
    instructions: string;
  }>;
}

export default function Home() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [showLocationInput, setShowLocationInput] = useState<
    "start" | "end" | "waypoint" | null
  >(null);
  const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const startLocation = locations.find((loc) => loc.type === "start") || null;
  const endLocation = locations.find((loc) => loc.type === "end") || null;
  const waypoints = locations.filter((loc) => loc.type === "waypoint");

  const handleLocationSelect = (place: string, lat: number, lng: number) => {
    const newLocation: Location = {
      id: Date.now().toString(),
      place,
      lat,
      lng,
      type: showLocationInput || "waypoint",
    };

    if (showLocationInput === "start" || showLocationInput === "end") {
      setLocations((prev) => [
        ...prev.filter((loc) => loc.type !== showLocationInput),
        newLocation,
      ]);
    } else {
      setLocations((prev) => [...prev, newLocation]);
    }
    setShowLocationInput(null);
  };

  const handleRemoveLocation = (id: string) => {
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const items = [...locations];
    const draggedItemContent = items[draggedItem];

    // Don't allow dragging start/end locations
    if (
      draggedItemContent.type === "start" ||
      draggedItemContent.type === "end"
    )
      return;

    // Remove the dragged item
    items.splice(draggedItem, 1);
    // Insert it at the new position
    items.splice(index, 0, draggedItemContent);

    setLocations(items);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleRouteUpdate = (details: RouteDetails | null) => {
    setRouteDetails(details);
  };

  return (
    <main className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-8">
        <div className="relative h-[60vh] mb-8">
          <div className="w-full h-full overflow-hidden bg-transparent shadow-none border-1 rounded-md">
            <Map
              startLocation={startLocation}
              endLocation={endLocation}
              waypoints={waypoints}
              onAddStart={() => setShowLocationInput("start")}
              onAddEnd={() => setShowLocationInput("end")}
              onAddWaypoint={() => setShowLocationInput("waypoint")}
              onRemoveWaypoint={handleRemoveLocation}
              onRouteUpdate={handleRouteUpdate}
            />
          </div>

          {showLocationInput && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-96 z-10">
              <LocationSearchInput
                onSelect={handleLocationSelect}
                placeholder={`Enter ${showLocationInput} location...`}
                onClose={() => setShowLocationInput(null)}
              />
            </div>
          )}
        </div>

        <Card className="p-6 bg-white/80 backdrop-blur-sm mb-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Route Locations</h2>
              <div className="flex gap-2">
                {!startLocation && (
                  <Button
                    type="default"
                    size="small"
                    onClick={() => setShowLocationInput("start")}
                  >
                    <FaMapMarkerAlt className="mr-2 text-green-500" />
                    Add Start
                  </Button>
                )}
                <Button
                  type="default"
                  size="small"
                  onClick={() => setShowLocationInput("waypoint")}
                >
                  <FaArrowRight className="mr-2 text-blue-500" />
                  Add Stop
                </Button>
                {!endLocation && (
                  <Button
                    type="default"
                    size="small"
                    onClick={() => setShowLocationInput("end")}
                  >
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    Add End
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {locations.map((location, index) => (
                <div
                  key={location.id}
                  draggable={location.type === "waypoint"}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 p-3 bg-white rounded-lg border ${
                    draggedItem === index ? "opacity-50" : ""
                  } ${location.type === "waypoint" ? "cursor-move" : ""}`}
                >
                  {location.type === "waypoint" && (
                    <FaGripLines className="text-gray-400" />
                  )}
                  {location.type === "start" && (
                    <FaMapMarkerAlt className="text-green-500" />
                  )}
                  {location.type === "waypoint" && (
                    <FaArrowRight className="text-blue-500" />
                  )}
                  {location.type === "end" && (
                    <FaMapMarkerAlt className="text-red-500" />
                  )}
                  <span className="flex-grow">{location.place}</span>
                  <Button
                    type="link"
                    size="small"
                    className="text-gray-500 hover:text-red-500"
                    onClick={() => handleRemoveLocation(location.id)}
                  >
                    <FaTimes />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {routeDetails && (
          <Card className="p-6 bg-white/80 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Route Details</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-blue-500" />
                    <span>{routeDetails.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-blue-500" />
                    <span>{routeDetails.distance}</span>
                  </div>
                </div>
              </div>

              <div style={{ height: 300, overflowY: "auto" }}>
                <div className="space-y-4">
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-semibold mb-4">
                      Turn-by-turn directions
                    </h3>
                    {routeDetails.steps.map((step, index) => (
                      <div key={index} className="py-2 flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: step.instructions,
                            }}
                          />
                          <div className="text-sm text-gray-500 mt-1">
                            {step.distance} · {step.duration}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
