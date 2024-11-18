import React, { useState } from "react";
import { Drawer, Checkbox, Collapse, Button, Space } from "antd";
import { FilterOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const FiltersSidebar: React.FC = () => {
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
      >
        {/* Collapsible Filter Groups */}
        <Collapse defaultActiveKey={["1"]} ghost>
          {/* Car Availability */}
          <Panel header="Car Availability" key="1">
            {renderCheckboxGroup("availability", ["Active", "Inactive"])}
          </Panel>

          {/* Car Years */}
          <Panel header="Car Years" key="2">
            {renderCheckboxGroup("years", ["2020", "2021", "2022", "2023"])}
          </Panel>

          {/* Car Brands */}
          <Panel header="Car Brands" key="3">
            {renderCheckboxGroup("brands", ["Toyota", "Honda", "BMW", "Tesla"])}
          </Panel>

          {/* Car Category */}
          <Panel header="Car Category" key="4">
            {renderCheckboxGroup("categories", [
              "SUV",
              "Sedan",
              "Truck",
              "Hatchback",
            ])}
          </Panel>

          {/* Car Fuel Type */}
          <Panel header="Car Fuel Type" key="5">
            <Space size="middle" className="flex flex-wrap mt-2">
              {["Petrol", "Diesel", "Electric"].map((fuel) => (
                <Button
                  key={fuel}
                  type={
                    selectedFilters["fuelType"]?.includes(fuel)
                      ? "primary"
                      : "default"
                  }
                  onClick={() => handleCheckboxChange("fuelType", fuel)}
                  style={{ margin: "0 0.5rem 0.5rem 0" }}
                >
                  {fuel}
                </Button>
              ))}
            </Space>
          </Panel>
        </Collapse>
      </Drawer>
    </div>
  );
};

export default FiltersSidebar;
