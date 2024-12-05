"use client";

import { useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Card, Input, List, Button } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";

interface LocationSearchInputProps {
  onSelect: (place: string, lat: number, lng: number) => void;
  placeholder?: string;
  onClose: () => void;
}

export default function LocationSearchInput({
  onSelect,
  placeholder = "Search location...",
  onClose,
}: LocationSearchInputProps) {
  const [selectedValue, setSelectedValue] = useState("");

  const {
    ready,
    suggestions: { status, data },
    setValue: setSearchValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {},
    debounce: 300,
  });

  const handleSelect = async (address: string) => {
    setSelectedValue(address);
    setSearchValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      onSelect(address, lat, lng);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <Card className="relative shadow-lg" bordered>
      <Button
        shape="circle"
        icon={<CloseOutlined />}
        onClick={onClose}
        className="absolute right-2 top-2 z-10"
      />
      <Input
        placeholder={placeholder}
        value={selectedValue}
        onChange={(e) => {
          setSelectedValue(e.target.value);
          setSearchValue(e.target.value);
        }}
        allowClear
        className="h-11 mb-2"
      />
      <List
        bordered
        dataSource={status === "OK" ? data : []}
        renderItem={({ place_id, description }) => (
          <List.Item
            key={place_id}
            onClick={() => handleSelect(description)}
            className="cursor-pointer hover:bg-gray-100"
          >
            <div className="flex items-center">
              {selectedValue === description && (
                <CheckOutlined className="text-green-500 mr-2" />
              )}
              {description}
            </div>
          </List.Item>
        )}
        locale={{ emptyText: "No location found." }}
      />
    </Card>
  );
}
