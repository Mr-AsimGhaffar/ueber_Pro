import { Button, Popconfirm, message, Dropdown, Menu } from "antd";
import { useState } from "react";

const UpdateStatus = ({
  offerId,
  refreshData,
}: {
  offerId: Number;
  refreshData: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async (status: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/offers/updateStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ offerId, status }),
      });

      if (response.ok) {
        const data = await response.json();
        message.success(data.message || "Offer Updated successfully!");
        refreshData();
      } else {
        const errorData = await response.json();
        message.error(errorData.message || "Failed to Update the status.");
      }
    } catch (error) {
      console.error("Error Updating status:", error);
      message.error("An error occurred while Updating the status.");
    } finally {
      setLoading(false);
    }
  };
  const menu = (
    <Menu>
      <Menu.Item key="accept" onClick={() => handleUpdateStatus("ACCEPTED")}>
        Accept
      </Menu.Item>
      <Menu.Item key="reject" onClick={() => handleUpdateStatus("REJECTED")}>
        Reject
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button className="text-blue-500 font-semibold" type="link">
        Update Offer Status
      </Button>
    </Dropdown>
  );
};

export default UpdateStatus;
