"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, Button, Divider } from "antd";
import { MdLocationOn, MdOutlineNavigation, MdTimer } from "react-icons/md";
import { FaGripLinesVertical, FaRegTimesCircle } from "react-icons/fa";
import { AiOutlineArrowRight } from "react-icons/ai";
import LocationSearchInput from "@/components/map/locationSearchInput";

const Map = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
});

interface TripMapProps {
  onLocationsChange: (locations: {
    startLocation: Location | null;
    endLocation: Location | null;
    waypoints: Location[];
  }) => void;
  initialLocations?: {
    startLocation: Location | null;
    endLocation: Location | null;
    waypoints: Location[];
  };
}

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

const init = (initialLocations: any) => {
  const initLocations = [];

  if (initialLocations.startLocation) {
    initLocations.push(initialLocations.startLocation);
  }

  if (initialLocations.endLocation) {
    initLocations.push(initialLocations.endLocation);
  }
  if (initialLocations.waypoints) {
    initLocations.push(...initialLocations.waypoints);
  }
  return initLocations;
};

export default function Home({
  onLocationsChange,
  initialLocations = { startLocation: null, endLocation: null, waypoints: [] },
}: TripMapProps) {
  const [locations, setLocations] = useState<Location[]>(() =>
    init(initialLocations)
  );

  const [showLocationInput, setShowLocationInput] = useState<
    "start" | "end" | "waypoint" | null
  >(null);
  const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const startLocation = locations.find((loc) => loc.type === "start") || null;
  const endLocation = locations.find((loc) => loc.type === "end") || null;
  const waypoints = locations.filter((loc) => loc.type === "waypoint");

  useEffect(() => {
    setLocations(init(initialLocations));
  }, [initialLocations]);
  const handleLocationSelect = (place: string, lat: number, lng: number) => {
    const newLocation: Location = {
      id: Date.now().toString(),
      place,
      lat,
      lng,
      type: showLocationInput || "waypoint",
    };

    const updatedLocations =
      showLocationInput === "start" || showLocationInput === "end"
        ? [
            ...locations.filter((loc) => loc.type !== showLocationInput),
            newLocation,
          ]
        : [...locations, newLocation];

    setLocations(updatedLocations);

    // Notify parent component
    onLocationsChange({
      startLocation:
        updatedLocations.find((loc) => loc.type === "start") || null,
      endLocation: updatedLocations.find((loc) => loc.type === "end") || null,
      waypoints: updatedLocations.filter((loc) => loc.type === "waypoint"),
    });

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
          <div className="w-full h-full overflow-hidden bg-transparent shadow-none rounded-lg">
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
                    <MdLocationOn className="mr-2 text-green-500" />
                    Add Start
                  </Button>
                )}
                <Button
                  type="default"
                  size="small"
                  onClick={() => setShowLocationInput("waypoint")}
                >
                  <AiOutlineArrowRight className="mr-2 text-blue-500" />
                  Add Stop
                </Button>
                {!endLocation && (
                  <Button
                    type="default"
                    size="small"
                    onClick={() => setShowLocationInput("end")}
                  >
                    <MdOutlineNavigation className="mr-2 text-red-500" />
                    Add End
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {locations.map((location, index) => (
                <div
                  key={index}
                  draggable={location.type === "waypoint"}
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 p-3 bg-white rounded-lg border ${
                    draggedItem === index ? "opacity-50" : ""
                  } ${location.type === "waypoint" ? "cursor-move" : ""}`}
                >
                  {location.type === "waypoint" && (
                    <FaGripLinesVertical className="text-gray-400" />
                  )}
                  {location.type === "start" && (
                    <MdLocationOn className="text-green-500 flex-shrink-0" />
                  )}
                  {location.type === "waypoint" && (
                    <AiOutlineArrowRight className="text-blue-500 flex-shrink-0" />
                  )}
                  {location.type === "end" && (
                    <MdOutlineNavigation className="text-red-500 flex-shrink-0" />
                  )}
                  <span className="flex-grow">{location.place}</span>
                  <Button
                    type="text"
                    size="small"
                    className="text-gray-500 hover:text-red-500"
                    onClick={() => handleRemoveLocation(location.id)}
                  >
                    <FaRegTimesCircle />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {routeDetails && (
          <Card className="p-6 bg-white/80 backdrop-blur-sm overflow-x-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Route Details</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <MdTimer className="text-blue-500" />
                    <span>{routeDetails.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdLocationOn className="text-blue-500" />
                    <span>{routeDetails.distance}</span>
                  </div>
                </div>
              </div>

              <div className="h-[300px] pr-4">
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
