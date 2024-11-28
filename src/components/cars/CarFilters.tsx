import React, { useState } from "react";
import { Drawer, Checkbox, Collapse, Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const FiltersSidebar: React.FC<{
  setFilters: (filters: Record<string, string[]>) => void;
}> = ({ setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

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
    <div className="flex flex-col space-y-2 mt-2">
      {options.map((option) => (
        <Checkbox
          key={option}
          onChange={() => handleCheckboxChange(category, option)}
          checked={selectedFilters[category]?.includes(option)}
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
    // mileage: ["0-10", "10-20", "20+"],
  };

  const handleApplyFilters = () => {
    setFilters(selectedFilters);
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
        <Collapse defaultActiveKey={["1"]} ghost>
          {Object.entries(filterOptions).map(([category, options], index) => (
            <Panel header={category.toUpperCase()} key={index}>
              {renderCheckboxGroup(category, options)}
            </Panel>
          ))}
        </Collapse>
      </Drawer>
    </div>
  );
};

export default FiltersSidebar;
