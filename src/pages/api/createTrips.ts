import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      carId,
      pricingModelId,
      startLocation,
      endLocation,
      waypoints,
      startTime,
      endTime,
      pickupLat,
      pickupLong,
      dropoffLat,
      dropoffLong,
      cost,
    } = req.body;

    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        throw new Error("Token not found. Please log in.");
      }
      const requestBody: any = {
        carId,
        pricingModelId,
        startLocation,
        endLocation,
        startTime,
        endTime,
        pickupLat,
        pickupLong,
        dropoffLat,
        dropoffLong,
        clientType: "web",
      };

      if (cost !== undefined && cost !== null) {
        requestBody.cost = String(cost);
      }
      if (waypoints !== undefined && waypoints !== null) {
        requestBody.waypoints = waypoints;
      }
      // Send credentials to external API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/trip/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const apiResponse = await response.json();

        return res.status(200).json({
          data: apiResponse.data,
          message: "Successfully create trip",
        });
      } else {
        const errorData = await response.json();
        return res
          .status(response.status)
          .json({ message: errorData.message || "Failed to create trip" });
      }
    } catch (error) {
      console.error("Error authenticating:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
