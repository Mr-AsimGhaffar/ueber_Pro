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
        type = "",
      } = req.query;

      // Send credentials to external API
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/trips/?page=${page}&limit=${limit}&filters=${filters}&sort=${sort}&search=${search}&searchFields=${searchFields}&type=${type}`,
        {
          method: "GET",
        },
        { accessToken, refreshToken }
      );

      if (response.ok) {
        const tripsResponse = await response.json();
        return res.status(200).json({
          ...tripsResponse,
          message: "Successfully fetched trips",
        });
      } else {
        const errorData = await response.json();
        return res
          .status(response.status)
          .json({ message: errorData.message || "Failed to fetched trips" });
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
