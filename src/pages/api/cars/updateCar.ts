import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const {
      id,
      carModel,
      carBrand,
      registrationNumber,
      transmission,
      year,
      carCategory,
      carFuelType,
      color,
      companyId,
      status,
      hourlyRate,
      dailyRate,
      weeklyRate,
      monthlyRate,
    } = req.body;

    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        throw new Error("Token not found. Please log in.");
      }

      const convertToCents = (rate: any) => {
        const num = Number(rate);
        if (isNaN(num) || num < 0) {
          throw new Error(
            "Invalid rate value. Rates must be positive numbers."
          );
        }
        return Math.round(num * 100).toString();
      };

      const rentalPricing = {
        hourlyRate: convertToCents(hourlyRate),
        dailyRate: convertToCents(dailyRate),
        weeklyRate: convertToCents(weeklyRate),
        monthlyRate: convertToCents(monthlyRate),
      };

      // Send credentials to external API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/cars`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            id,
            carModel,
            carBrand,
            registrationNumber,
            transmission,
            year,
            carCategory,
            carFuelType,
            color,
            companyId,
            status,
            rentalPricing,
          }),
        }
      );

      if (response.ok) {
        const apiResponse = await response.json();
        return res.status(200).json({
          data: apiResponse.data,
          message: "Successfully updated Car",
        });
      } else {
        const errorData = await response.json();
        return res.status(response.status).json({
          message: errorData.message || "Failed to update Car",
        });
      }
    } catch (error) {
      console.error("Error authenticating:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
