import { Input, Select } from "antd";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";
import { useState } from "react";

interface SearchFiltersUsersProps {
  onFilterChange: (value: string, filters: { status: string[] }) => void;
}

const FilterBar: React.FC<SearchFiltersUsersProps> = ({ onFilterChange }) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
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
    onFilterChange(value, { status: selectedStatus });
  };

  const handleStatusChange = (selectedKeys: React.Key[]) => {
    setSelectedStatus(selectedKeys as string[]);
    onFilterChange(searchValue, {
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

  const menuItemsStatus = [
    { key: "AVAILABLE", label: "Available" },
    { key: "ON_LEAVE", label: "On Leave" },
    { key: "SUSPENDED", label: "Suspended" },
    { key: "OFF_DUTY", label: "Off Duty" },
    { key: "ON_TRIP", label: "On Trip" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        {/* Search Input */}
        <div>
          <Input
            placeholder="Search Drivers"
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-80"
          />
        </div>
        <div className="flex items-center gap-2">
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
