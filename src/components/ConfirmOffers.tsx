import { Button, Popconfirm, Input, message } from "antd";
import { useState } from "react";

const ConfirmOffers = ({
  tripId,
  hasOffer,
  refreshData,
}: {
  tripId: Number;
  hasOffer: boolean;
  refreshData: () => void;
}) => {
  const [offeredPrice, setOfferedPrice] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);

  const handleCreateOffer = async () => {
    if (!offeredPrice || isNaN(Number(offeredPrice))) {
      message.error("Please enter a valid price.");
      return;
    }
    const offeredPriceInCents = Math.round(Number(offeredPrice) * 100);

    setLoading(true);
    try {
      const response = await fetch("/api/offers/createOffer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tripId, offeredPrice: offeredPriceInCents }),
      });

      if (response.ok) {
        const data = await response.json();
        message.success(data.message || "Offer created successfully!");
        refreshData();
      } else {
        const errorData = await response.json();
        message.error(errorData.message || "Failed to create offer.");
      }
    } catch (error) {
      console.error("Error creating offer:", error);
      message.error("An error occurred while creating the offer.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Popconfirm
      title={
        <div>
          <p>Enter your offer price:</p>
          <Input
            type="number"
            placeholder="Offer Price in Dollars"
            value={offeredPrice}
            onChange={(e) => setOfferedPrice(e.target.value)}
          />
        </div>
      }
      onConfirm={handleCreateOffer}
      okButtonProps={{ loading }}
      onCancel={() => setOfferedPrice(undefined)}
      okText="Submit"
      cancelText="Cancel"
      disabled={hasOffer}
    >
      <Button disabled={hasOffer} type="link">
        Offers
      </Button>
    </Popconfirm>
  );
};

export default ConfirmOffers;
