import { NextApiRequest, NextApiResponse } from "next";
import { fetchWithAuth } from "../refreshToken/refreshAccessToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { filters, page, limit, search, searchFields = "" } = req.query;
      const accessToken = req.cookies.accessToken || "";
      const refreshToken = req.cookies.refreshToken || "";
      // If the user is not authenticated, fetch from the public API
      const endpoint = accessToken
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/cars/?page=${page}&limit=${limit}&filters=${filters}&search=${search}&searchFields=${searchFields}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/cars/public?page=${page}&limit=${limit}&filters=${filters}&search=${search}&searchFields=${searchFields}`;

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
          ...carResponse,
          message: "Successfully fetched cars",
        });
      } else {
        const errorData = await response.json();
        return res
          .status(response.status)
          .json({ message: errorData.message || "Failed to fetch cars" });
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
