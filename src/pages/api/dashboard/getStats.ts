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

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/stats/`,
        { method: "GET" },
        { accessToken, refreshToken }
      );

      const apiResponse = await response.json();
      return res.status(200).json({
        ...apiResponse,
        message: "Successfully fetched stats response",
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
