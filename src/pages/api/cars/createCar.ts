import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      carModel,
      carBrand,
      registrationNumber,
      transmission,
      year,
      status,
      carCategory,
      carFuelType,
      companyId,
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
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            carModel,
            carBrand,
            registrationNumber,
            transmission,
            year: Number(year),
            status,
            carCategory,
            carFuelType,
            companyId: Number(companyId),
            rentalPricing,
          }),
        }
      );

      if (response.ok) {
        const apiResponse = await response.json();

        return res.status(200).json({
          data: apiResponse.data,
          message: "Car created successfully",
        });
      } else {
        const errorData = await response.json();
        return res
          .status(response.status)
          .json({ message: errorData.message || "Failed to create car" });
      }
    } catch (error) {
      console.error("Error creating car:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
