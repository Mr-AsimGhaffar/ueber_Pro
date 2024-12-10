import { DriverName } from "@/app/[lang]/index/driverTrips/page";
import { Popconfirm, Select, message } from "antd";
import { useState } from "react";

const AssignDriver = ({
  refreshData,
  tripId,
  DriverName,
}: {
  refreshData: () => void;
  tripId: Number;
  DriverName: DriverName[];
}) => {
  const [loading, setLoading] = useState(false);

  const handleAssignDriver = async (selectedDriver: any) => {
    if (selectedDriver !== null) {
      try {
        // Prepare data for updating the trip
        const response = await fetch("/api/updateTrips", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tripId,
            driverId: selectedDriver,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          message.success("Driver assigned and trip updated successfully.");
          refreshData(); // Refresh the data after successful update
        } else {
          const errorData = await response.json();
          message.error(
            errorData.message || "Failed to assign driver or update trip."
          );
        }
      } catch (error) {
        console.error("Error assigning driver or updating trip:", error);
        message.error("An error occurred while assigning the driver.");
      }
    }
  };

  return (
    <div>
      <Select
        placeholder="Select Driver"
        loading={loading}
        style={{ width: 200 }}
      >
        {DriverName.map((driver) => (
          <Select.Option key={driver.id} value={driver.id}>
            <Popconfirm
              title="Are you sure you want to assign this driver?"
              onConfirm={() => handleAssignDriver(driver.id)}
              okButtonProps={{ loading }}
              okText="Ok"
              cancelText="Cancel"
            >
              <span>{`${driver.user.firstName} ${driver.user.lastName}`}</span>
            </Popconfirm>
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

export default AssignDriver;
