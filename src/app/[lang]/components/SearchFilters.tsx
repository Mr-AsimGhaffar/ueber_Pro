import { Input, Dropdown, Button, Modal, Menu } from "antd";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";
import { useState } from "react";

const FilterBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const menuItems = [
    { key: "1", label: "Option 1" },
    { key: "2", label: "Option 2" },
    { key: "3", label: "Option 3" },
  ];

  const menu = <Menu items={menuItems} />;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        {/* Search Input */}
        <div>
          <Input
            placeholder="Search customers"
            prefix={<SearchOutlined />}
            className="w-80"
          />
        </div>
        <div className="flex items-center">
          {/* Country Dropdown */}
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button className="flex items-center font-sansInter rounded-r-none w-40">
              Country <DownOutlined className="ml-2" />
            </Button>
          </Dropdown>

          {/* VIP Dropdown */}
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button className="flex items-center font-sansInter rounded-l-none rounded-r-none w-40">
              VIP <DownOutlined className="ml-2" />
            </Button>
          </Dropdown>

          {/* More Filters */}
          <Button
            type="primary"
            onClick={handleOpenModal}
            className=" font-sansInter rounded-l-none w-40"
          >
            More filters
          </Button>
        </div>
      </div>
      {/* Modal */}
      <Modal
        title="More Filters"
        open={isModalOpen}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
      >
        <p>Filter options can go here!</p>
      </Modal>
    </div>
  );
};

export default FilterBar;
