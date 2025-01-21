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

      // Send credentials to external API
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoices/${id}`,
        {
          method: "GET",
        },
        { accessToken, refreshToken }
      );

      if (response.ok) {
        const accountResponse = await response.json();
        return res.status(200).json({
          data: accountResponse.data,
          message: "Successfully fetched accounts data",
        });
      } else {
        const errorData = await response.json();
        return res.status(response.status).json({
          message: errorData.message || "Failed to fetch accounts data",
        });
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
