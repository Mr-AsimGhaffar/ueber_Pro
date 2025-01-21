import { NextApiRequest, NextApiResponse } from "next";
import { fetchWithAuth } from "./refreshToken/refreshAccessToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const accessToken = req.cookies.accessToken || "";
      const refreshToken = req.cookies.refreshToken || "";
      const {
        page = 1,
        limit = 10,
        filters = "",
        sort = "",
        search = "",
        searchFields = "",
      } = req.query;

      // Send credentials to external API
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/drivers/?page=${page}&limit=${limit}&filters=${filters}&sort=${sort}&search=${search}&searchFields=${searchFields}`,
        {
          method: "GET",
        },
        { accessToken, refreshToken }
      );

      if (response.ok) {
        const adminResponse = await response.json();

        return res.status(200).json({
          ...adminResponse,
          message: "Successfully added driver",
        });
      } else {
        const errorData = await response.json();
        return res
          .status(response.status)
          .json({ message: errorData.message || "Failed to add driver" });
      }
    } catch (error) {
      console.error("Error authenticating:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
