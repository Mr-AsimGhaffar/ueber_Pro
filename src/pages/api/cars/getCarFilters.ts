import { NextApiRequest, NextApiResponse } from "next";
import { fetchWithAuth } from "../refreshToken/refreshAccessToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const accessToken = req.cookies.accessToken || "";
      const refreshToken = req.cookies.refreshToken || "";

      // Send credentials to external API
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/cars/filters/`,
        {
          method: "GET",
        },
        { accessToken, refreshToken }
      );

      if (response.ok) {
        const carFilterResponse = await response.json();
        return res.status(200).json({
          data: carFilterResponse.data,
          message: "Successfully fetched car filters data",
        });
      } else {
        const errorData = await response.json();
        return res.status(response.status).json({
          message: errorData.message || "Failed to fetch car filters data",
        });
      }
    } catch (error) {
      console.error("Error fetching car filters:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
