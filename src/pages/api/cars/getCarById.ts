import { NextApiRequest, NextApiResponse } from "next";
import { fetchWithAuth } from "../refreshToken/refreshAccessToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;

    try {
      const accessToken = req.cookies.accessToken || "";
      const refreshToken = req.cookies.refreshToken || "";

      // If the user is not authenticated, fetch from the public API
      const endpoint = accessToken
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/cars/${id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/cars/public/${id}`;

      const response = await fetchWithAuth(
        endpoint,
        {
          method: "GET",
        },
        { accessToken, refreshToken }
      );

      if (response.ok) {
        const carResponse = await response.json();
        return res.status(200).json({
          data: carResponse.data,
          message: "Successfully fetched cars data",
        });
      } else {
        const errorData = await response.json();
        return res.status(response.status).json({
          message: errorData.message || "Failed to fetch cars data",
        });
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
