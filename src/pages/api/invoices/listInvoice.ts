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

      const {
        page = 1,
        limit = 10,
        filters = "",
        sort = "",
        type,
        search = "",
        searchFields = "",
      } = req.query;

      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/invoices?page=${page}&limit=${limit}&filters=${filters}&sort=${sort}&type=${type}&search=${search}&searchFields=${searchFields}`,
        { method: "GET" },
        { accessToken, refreshToken }
      );

      const companiesResponse = await response.json();

      return res.status(200).json({
        ...companiesResponse,
        message: "Successfully fetched accounts",
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
