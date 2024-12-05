import React, { useState } from "react";
import { Drawer, Checkbox, Collapse, Button, Input } from "antd";
import { FilterOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const FiltersSidebar: React.FC<{
  setFilters: (filters: Record<string, any>) => void;
}> = ({ setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [mileage, setMileage] = useState({ from: "", to: "" });

  const toggleDrawer = () => setIsOpen(!isOpen);

  const handleCheckboxChange = (category: string, value: string) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[category] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];
      return { ...prev, [category]: newValues };
    });
  };

  const renderCheckboxGroup = (category: string, options: string[]) => (
    <div className="flex flex-col space-y-2">
      {options.map((option) => (
        <Checkbox
          key={option}
          onChange={() => handleCheckboxChange(category, option)}
          checked={selectedFilters[category]?.includes(option)}
          className="font-sansInter text-xs"
        >
          {option}
        </Checkbox>
      ))}
    </div>
  );

  const filterOptions = {
    status: ["AVAILABLE", "IN_USE", "MAINTENANCE"],
    year: Array.from({ length: 35 }, (_, i) => (2024 - i).toString()),
    brand: ["Toyota", "Honda", "BMW", "Tesla"],
    category: ["SUV", "Sedan", "Truck", "Hatchback"],
    carFuelType: ["Petrol", "Diesel", "Electric"],
    transmission: ["AUTOMATIC", "MANUAL", "SEMI_AUTOMATIC"],
    rating: ["1", "2", "3", "4", "5"],
    color: ["Red", "Blue", "Black", "White", "Gray"],
    capacity: ["2", "4", "6", "8"],
  };

  const handleMileageChange = (type: "from" | "to", value: string) => {
    setMileage((prev) => ({ ...prev, [type]: value }));
  };

  const handleApplyFilters = () => {
    const updatedFilters = {
      ...selectedFilters,
      mileage,
    };
    setFilters(updatedFilters);
    toggleDrawer();
  };

  return (
    <div>
      {/* Filter Button */}
      <Button
        icon={<FilterOutlined />}
        type="primary"
        className="mb-4"
        onClick={toggleDrawer}
      >
        Filters
      </Button>

      {/* Drawer */}
      <Drawer
        title="Filters"
        placement="left"
        onClose={toggleDrawer}
        open={isOpen}
        width={300}
        footer={
          <Button type="primary" block onClick={handleApplyFilters}>
            Apply Filters
          </Button>
        }
      >
        {/* Collapsible Filter Groups */}
        <Collapse
          defaultActiveKey={["1"]}
          ghost
          className="[&_.ant-collapse-header]:text-xs [&_.ant-collapse-header]:font-bold"
        >
          {Object.entries(filterOptions).map(([category, options], index) => (
            <Panel header={category.toUpperCase()} key={index}>
              {renderCheckboxGroup(category, options)}
            </Panel>
          ))}
          <Panel header="MILEAGE" key="mileage">
            <div className="flex items-center">
              <Input
                placeholder="From"
                value={mileage.from}
                onChange={(e) => handleMileageChange("from", e.target.value)}
                className="rounded-r-none"
              />
              <Input
                placeholder="To"
                value={mileage.to}
                onChange={(e) => handleMileageChange("to", e.target.value)}
                className="rounded-l-none"
              />
            </div>
          </Panel>
        </Collapse>
      </Drawer>
    </div>
  );
};

export default FiltersSidebar;
