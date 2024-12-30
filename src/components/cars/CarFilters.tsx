import React, { useEffect, useState } from "react";
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
  const [filterData, setFilterData] = useState<any>({});

  const toggleDrawer = () => setIsOpen(!isOpen);

  const formatText = (text: any) => {
    if (typeof text === "number" || !isNaN(text)) {
      return text.toString(); // Convert numbers to strings
    }
    if (typeof text !== "string") {
      return ""; // Fallback for invalid types
    }
    return text
      .split("_") // Split on underscores
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
      .join(" "); // Join with spaces
  };

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const response = await fetch("/api/cars/getCarFilters", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setFilterData(data.data);
        } else {
          console.error("Failed to fetch filter data");
        }
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchFilterData();
  }, []);

  const handleCheckboxChange = (category: string, value: string) => {
    setSelectedFilters((prev) => {
      const currentValues = prev[category] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];
      return { ...prev, [category]: newValues };
    });
  };

  const renderCheckboxGroup = (category: string, options: any[]) => (
    <div className="flex flex-col space-y-2">
      {options.map((option: any) => (
        <Checkbox
          key={option.id || option}
          onChange={() =>
            handleCheckboxChange(category, option.name || option.hex || option)
          }
          checked={selectedFilters[category]?.includes(
            option.name || option.hex || option
          )}
          className="font-sansInter text-xs"
        >
          {category === "colors" ? (
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: option.hex }}
            />
          ) : (
            formatText(option.name || option)
          )}
        </Checkbox>
      ))}
    </div>
  );

  const handleMileageChange = (type: "from" | "to", value: string) => {
    setMileage((prev) => ({ ...prev, [type]: value }));
  };

  const handleApplyFilters = () => {
    const updatedFilters = {
      ...selectedFilters,
      mileage: mileage.from || mileage.to ? mileage : undefined,
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
          ghost
          className="[&_.ant-collapse-header]:text-sm [&_.ant-collapse-header]"
        >
          {filterData &&
            Object.entries(filterData).map(([category, options], index) => {
              // Render different types of filter options based on the category
              if (Array.isArray(options)) {
                return (
                  <Panel header={formatText(category)} key={index}>
                    {renderCheckboxGroup(category, options)}
                  </Panel>
                );
              }
              return null;
            })}
          <Panel header="Mileage" key="mileage">
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
