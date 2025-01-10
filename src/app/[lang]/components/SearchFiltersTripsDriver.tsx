import { Input, Select } from "antd";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";
import { useState } from "react";

interface SearchFiltersTripsDriverProps {
  onFilterChange: (
    value: string,
    filters: { status: string[]; "pricingModel.model": string[] }
  ) => void;
  selectedType: string;
}

const FilterBar: React.FC<SearchFiltersTripsDriverProps> = ({
  onFilterChange,
  selectedType,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedPricingModel, setSelectedPricingModel] = useState<string[]>(
    []
  );
  const handleSearch = (value: string) => {
    setSearchValue(value);
    onFilterChange(value, {
      status: selectedStatus,
      "pricingModel.model": selectedPricingModel,
    });
  };

  const handleStatusChange = (selectedKeys: React.Key[]) => {
    setSelectedStatus(selectedKeys as string[]);
    onFilterChange(searchValue, {
      status: selectedKeys as string[],
      "pricingModel.model": selectedPricingModel,
    });
  };
  const handlePricingModelChange = (selectedKeys: React.Key[]) => {
    setSelectedPricingModel(selectedKeys as string[]);
    onFilterChange(searchValue, {
      status: selectedStatus,
      "pricingModel.model": selectedKeys as string[],
    });
  };
  const menuItemsStatus = [
    { key: "SCHEDULED", label: "Scheduled" },
    { key: "ASSIGNED", label: "Assigned" },
    { key: "NOT_ASSIGNED", label: "Not assigned" },
    { key: "ON_THE_WAY", label: "On the way" },
    { key: "ARRIVED", label: "Arrived" },
    { key: "LOADING_IN_PROGRESS", label: "Loading in progress" },
    { key: "LOADING_COMPLETE", label: "Loading completed" },
    { key: "ON_THE_WAY_DESTINATION", label: "On the way" },
    { key: "ARRIVED_DESTINATION", label: "Arrived" },
    { key: "COMPLETED", label: "Completed" },
    { key: "CANCELLED", label: "Cancelled" },
  ];
  const menuPricingModel = [
    { key: "FIXED_PRICE", label: "Fixed Price" },
    { key: "OPEN_BIDDING", label: "Open Bidding" },
    { key: "BROKERAGE", label: "Brokerage" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        {/* Search Input */}
        {/* <div>
          <Input
            placeholder="Search trips"
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-80"
          />
        </div> */}

        <div className="flex items-center gap-2">
          {selectedType !== "AVAILABLE" && (
            <Select
              mode="multiple"
              placeholder="Select Status"
              value={selectedStatus}
              onChange={handleStatusChange}
              style={{ width: 200 }}
              options={menuItemsStatus.map((item) => ({
                label: item.label,
                value: item.key,
              }))}
            />
          )}

          <Select
            mode="multiple"
            placeholder="Select Pricing Model"
            value={selectedPricingModel}
            onChange={handlePricingModelChange}
            style={{ width: 220 }}
            options={menuPricingModel.map((item) => ({
              label: item.label,
              value: item.key,
            }))}
            className="placeholder:text-red-400"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
