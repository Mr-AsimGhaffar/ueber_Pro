import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        throw new Error("Token not found. Please log in.");
      }

      // Send credentials to external API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/trip/pricing-models/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const tripResponse = await response.json();
        return res.status(200).json({
          data: tripResponse.data,
          message: "Successfully fetched trips pricing model",
        });
      } else {
        const errorData = await response.json();
        return res.status(response.status).json({
          message: errorData.message || "Failed to fetch trips pricing model",
        });
      }
    } catch (error) {
      console.error("Error fetching trip pricing model:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
