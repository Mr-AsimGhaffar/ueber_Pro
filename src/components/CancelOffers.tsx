import { Button, Popconfirm, Input, message } from "antd";
import { useState } from "react";

const CancelOffers = ({
  offerId,
  refreshData,
}: {
  offerId: Number;
  refreshData: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const handleCancelOffer = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/offers/cancelOffer", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ offerId }),
      });

      if (response.ok) {
        const data = await response.json();
        message.success(data.message || "Offer cancelled successfully!");
        refreshData();
      } else {
        const errorData = await response.json();
        message.error(errorData.message || "Failed to cancel the offer.");
      }
    } catch (error) {
      console.error("Error creating offer:", error);
      message.error("An error occurred while cancelling the offer.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Popconfirm
      title="Are you sure you want to cancel this offer?"
      onConfirm={handleCancelOffer}
      okButtonProps={{ loading }}
      okText="Yes"
      cancelText="No"
    >
      <Button className="text-red-500 font-semibold" type="link">
        Cancel Offer
      </Button>
    </Popconfirm>
  );
};

export default CancelOffers;
