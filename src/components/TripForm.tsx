import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, DatePicker } from "antd";
import TripMap from "@/components/map/TripMap";
import { useCar } from "@/hooks/context/AuthContextCars";
import dayjs from "dayjs";

interface UserTripProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  initialValues?: any;
}

interface PricingModel {
  id: number;
  model: string;
}

interface Location {
  id: string;
  place: string;
  lat: number;
  lng: number;
  type: "start" | "end" | "waypoint";
}

export default function TripForm({
  onSubmit,
  onCancel,
  initialValues,
}: UserTripProps) {
  const [form] = Form.useForm();
  const [mapData, setMapData] = useState<{
    startLocation: Location | null;
    endLocation: Location | null;
    waypoints: Location[];
  }>({
    startLocation: null,
    endLocation: null,
    waypoints: [],
  });
  const handleMapLocationsChange = (locations: any) => {
    setMapData(locations);
  };

  const [tripModelName, setTripModelName] = useState<PricingModel[]>([]);
  const [loading, setLoading] = useState(false);
  const { cars } = useCar();
  const [showPriceField, setShowPriceField] = useState(true);

  useEffect(() => {
    const fetchPricingModel = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/getAllTripPricingModel", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTripModelName(data.data); // Assuming API response has `data` with company list
        } else {
          console.error("Failed to fetch trips pricing model");
        }
      } catch (error) {
        console.error("Error fetching trips pricing model:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPricingModel();
  }, []);

  // Set the form's fields to initialValues when editing
  useEffect(() => {
    if (initialValues) {
      const startTime = initialValues.startTime
        ? dayjs(initialValues.startTime)
        : undefined;
      const selectedModel = tripModelName.find(
        (model) => model.id === initialValues.pricingModelId
      );
      setShowPriceField(selectedModel?.model !== "OPEN_BIDDING");
      const selectedCar = cars?.data.find(
        (car) => car.id === initialValues.carId
      );

      form.setFieldsValue({
        ...initialValues,
        cost: initialValues.cost / 100,
        profilePictureId: initialValues?.profilePictureId || "",
        startTime: startTime?.isValid() ? startTime : undefined,
        carId: selectedCar
          ? { value: selectedCar.id, label: selectedCar.model.name }
          : undefined,
      });
      const { startLocation, endLocation } = initialValues;
      if (startLocation && endLocation) {
        setMapData({
          startLocation: {
            id: "start",
            place: startLocation,
            lat: initialValues.pickupLat,
            lng: initialValues.pickupLong,
            type: "start",
          },
          endLocation: {
            id: "end",
            place: endLocation,
            lat: initialValues.dropoffLat,
            lng: initialValues.dropoffLong,
            type: "end",
          },
          waypoints: initialValues.waypoints.map((wp: any) => ({
            place: wp.location,
            lng: wp.longitude,
            lat: wp.latitude,
            type: "waypoint",
          })), // You can handle waypoints similarly if available in initialValues
        });
      }
    } else {
      form.resetFields();
      setMapData({
        startLocation: null,
        endLocation: null,
        waypoints: [],
      }); // Reset the form when initialValues is null (add new company)
    }
  }, [initialValues, form, tripModelName]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { startLocation, endLocation, waypoints } = mapData;
      if (!startLocation || !endLocation) {
        throw new Error("Start and end locations are required.");
      }
      if (values.profilePictureId?.file) {
        values.profilePictureId =
          values.profilePictureId.file.response?.url || ""; // Adjust based on your file upload API response
      }
      const waypointsPlaces = waypoints.map((wp, index) => ({
        location: wp.place,
        sequence: index + 1,
        longitude: wp.lng,
        latitude: wp.lat,
      }));
      const costInCents = Math.round(values.cost * 100);
      onSubmit({
        ...values,
        cost: costInCents,
        startLocation: startLocation.place,
        endLocation: endLocation.place,
        waypoints: waypointsPlaces,
        pickupLat: startLocation.lat,
        pickupLong: startLocation.lng,
        dropoffLat: endLocation.lat,
        dropoffLong: endLocation.lng,
      });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const pricingModelMap: { [key: string]: string } = {
    FIXED_PRICE: "Fixed Price",
    OPEN_BIDDING: "Open Bidding",
    BROKERAGE: "Brokerage",
    // Add other pricing models if needed
  };

  const handlePricingModelChange = (value: number) => {
    const selectedModel = tripModelName.find((model) => model.id === value);
    setShowPriceField(selectedModel?.model !== "OPEN_BIDDING");
  };

  return (
    <Form
      form={form}
      layout="vertical"
      // initialValues={initialValues}
      onFinish={handleSubmit}
      preserve={true}
      onValuesChange={(changedValues) => {
        if (changedValues.pricingModelId !== undefined) {
          handlePricingModelChange(changedValues.pricingModelId);
        }
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 text-center">
          <h1 className="font-medium text-base">
            {" "}
            {initialValues ? "Edit Trip" : "Add New Trip"}
          </h1>
        </div>

        <Form.Item
          name="pricingModelId"
          label="Pricing Model"
          rules={[{ required: true, message: "Please select pricing model" }]}
        >
          <Select
            showSearch
            placeholder="Select a pricing model"
            loading={loading}
            options={tripModelName.map((priceModal) => ({
              value: priceModal.id,
              label: pricingModelMap[priceModal.model] || priceModal.model,
            }))}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        {showPriceField && (
          <Form.Item
            name="cost"
            label="Price"
            rules={[{ required: true, message: "Please enter a price" }]}
          >
            <Input type="number" placeholder="Enter price" />
          </Form.Item>
        )}

        <Form.Item
          name="carId"
          label="Cars Name"
          rules={[{ required: true, message: "Please select a car" }]}
        >
          <Select
            showSearch
            placeholder="Select a car"
            loading={loading}
            options={cars?.data
              .filter((car) => car.status === "AVAILABLE") // Filter cars by status
              .map((car) => ({
                value: car.id,
                label: car.model.name,
              }))}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>

        {/* Start Time */}
        <Form.Item
          name="startTime"
          label="Start Time"
          rules={[{ required: true, message: "Please select a start time" }]}
        >
          <DatePicker showTime className="w-[100%]" />
        </Form.Item>

        <Form.Item label="Route" className="col-span-2">
          <TripMap
            initialLocations={mapData}
            onLocationsChange={handleMapLocationsChange}
          />
        </Form.Item>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 mt-6">
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          type="primary"
          onClick={handleSubmit}
          className="font-sansInter bg-teal-800 hover:!bg-teal-700"
        >
          {initialValues ? "Update Trip" : "Add Trip"}
        </Button>
      </div>
    </Form>
  );
}
