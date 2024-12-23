import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

interface SearchFiltersInvoiceProps {
  onFilterChange: (value: string, filters: { status: string[] }) => void;
}

const FilterBar: React.FC<SearchFiltersInvoiceProps> = ({ onFilterChange }) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    onFilterChange(value, {
      status: selectedStatus,
    });
  };

  const handleStatusChange = (selectedKeys: React.Key[]) => {
    setSelectedStatus(selectedKeys as string[]);
    onFilterChange(searchValue, {
      status: selectedKeys as string[],
    });
  };

  const menuItemsStatus = [
    { key: "PENDING", label: "Pending" },
    { key: "PAID", label: "Paid" },
    { key: "CANCELLED", label: "Cancelled" },
    { key: "OVERDUE", label: "Overdue" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        {/* Search Input */}
        <div>
          <Input
            placeholder="Search invoices"
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-80"
          />
        </div>
        <div className="flex items-center gap-2">
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
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
