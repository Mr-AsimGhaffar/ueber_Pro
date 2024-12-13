import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";

interface SearchFiltersAccountsProps {
  onFilterChange: (value: string) => void;
}

const FilterBar: React.FC<SearchFiltersAccountsProps> = ({
  onFilterChange,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const handleSearch = (value: string) => {
    setSearchValue(value);
    onFilterChange(value);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        {/* Search Input */}
        <div>
          <Input
            placeholder="Search accounts"
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-80"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
