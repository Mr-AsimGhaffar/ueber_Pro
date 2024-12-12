import { Button, Popconfirm, Input, message } from "antd";
import { useState } from "react";

const SelectTrip = ({
  tripId,
  refreshData,
  pricingModel,
  brokerageFee,
}: {
  tripId: Number;
  refreshData: () => void;
  pricingModel: string;
  brokerageFee: string;
}) => {
  const [loading, setLoading] = useState(false);

  const handleSelectTrip = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/offers/selectTrip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tripId }),
      });

      if (response.ok) {
        const data = await response.json();
        message.success(data.message || "Trip select successfully");
        refreshData();
      } else {
        const errorData = await response.json();
        message.error(errorData.message || "Failed to select trip.");
      }
    } catch (error) {
      console.error("Error selecting trip:", error);
      message.error("An error occurred while selecting the trip.");
    } finally {
      setLoading(false);
    }
  };
  const brokerageFeeInDollars = Number(brokerageFee) / 100;
  const popConfirmTitle =
    pricingModel === "BROKERAGE"
      ? `Buy with this price $${brokerageFeeInDollars}`
      : "Are you sure you want to select this trip";

  return (
    <Popconfirm
      title={<p>{popConfirmTitle}</p>}
      onConfirm={handleSelectTrip}
      okButtonProps={{ loading }}
      okText="Yes"
      cancelText="No"
    >
      <Button className="text-green-500 font-semibold" type="link">
        Select Trip
      </Button>
    </Popconfirm>
  );
};

export default SelectTrip;
