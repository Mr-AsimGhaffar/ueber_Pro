import { Input, Select } from "antd";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";
import { useState } from "react";

interface SearchFiltersProps {
  onFilterChange: (
    value: string,
    filters: { type: string[]; status: string[] }
  ) => void;
}

const FilterBar: React.FC<SearchFiltersProps> = ({ onFilterChange }) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  // const [filters, setFilters] = useState({
  //   type: [] as string[],
  //   status: [] as string[],
  //   address: "",
  //   email: "",
  //   contact: "",
  //   createdBy: "",
  // });

  // const handleOpenModal = () => {
  //   setIsModalOpen(true);
  // };

  // const handleCloseModal = () => {
  //   setIsModalOpen(false);
  // };
  const handleSearch = (value: string) => {
    setSearchValue(value);
    onFilterChange(value, { type: selectedType, status: selectedStatus });
  };
  const handleTypeChange = (selectedKeys: React.Key[]) => {
    setSelectedType(selectedKeys as string[]);
    onFilterChange(searchValue, {
      type: selectedKeys as string[],
      status: selectedStatus,
    });
  };

  const handleStatusChange = (selectedKeys: React.Key[]) => {
    setSelectedStatus(selectedKeys as string[]);
    onFilterChange(searchValue, {
      type: selectedType,
      status: selectedKeys as string[],
    });
  };
  // const handleFilterChange = (key: string, value: any) => {
  //   setFilters((prev) => ({ ...prev, [key]: value }));
  //   onFilterChange(key, value);
  // };

  // const handleCheckboxChange = (key: string, checkedValues: string[]) => {
  //   handleFilterChange(key, checkedValues);
  // };

  const menuItemsType = [
    { key: "CARS", label: "Cars" },
    { key: "DRIVERS", label: "Drivers" },
    { key: "ANY", label: "Other" },
  ];
  const menuItemsStatus = [
    { key: "ACTIVE", label: "Active" },
    { key: "IN_ACTIVE", label: "Inactive" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        {/* Search Input */}
        <div>
          <Input
            placeholder="Search companies"
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-80"
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Country Dropdown */}
          <Select
            mode="multiple"
            placeholder="Select Type"
            value={selectedType}
            onChange={handleTypeChange}
            style={{ width: 220 }}
            options={menuItemsType.map((item) => ({
              label: item.label,
              value: item.key,
            }))}
            className="placeholder:text-red-400"
          />

          {/* VIP Dropdown */}
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

          {/* More Filters */}
          {/* <Button
            type="primary"
            onClick={handleOpenModal}
            className=" font-sansInter rounded-l-none w-40"
          >
            More filters
          </Button> */}
        </div>
      </div>
      {/* Modal */}
      {/* <Modal
        title="More Filters"
        open={isModalOpen}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
      >
        <Form layout="vertical">
          <Form.Item label="Address">
            <Input
              placeholder="Search by Address"
              onChange={(e) => handleFilterChange("address", e.target.value)}
              allowClear
            />
          </Form.Item>
          <Form.Item label="Email">
            <Input
              placeholder="Search by Email"
              onChange={(e) => handleFilterChange("email", e.target.value)}
              allowClear
            />
          </Form.Item>
          <Form.Item label="Contact">
            <Input
              placeholder="Search by Contact"
              onChange={(e) => handleFilterChange("contact", e.target.value)}
              allowClear
            />
          </Form.Item>
          <Form.Item label="Created By">
            <Input
              placeholder="Search by Created By"
              onChange={(e) => handleFilterChange("createdBy", e.target.value)}
              allowClear
            />
          </Form.Item>
        </Form>
      </Modal> */}
    </div>
  );
};

export default FilterBar;
