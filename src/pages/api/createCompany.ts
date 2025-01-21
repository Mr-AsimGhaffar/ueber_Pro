import { NextApiRequest, NextApiResponse } from "next";
import { fetchWithAuth } from "./refreshToken/refreshAccessToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, type, address, status, email, contact, createdBy, logo } =
      req.body;

    try {
      const accessToken = req.cookies.accessToken || "";
      const refreshToken = req.cookies.refreshToken || "";
      // Send credentials to external API
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/companies`,
        {
          method: "POST",
          body: JSON.stringify({
            name,
            type,
            address,
            status,
            email,
            contact,
            createdBy,
            logo,
            clientType: "web",
          }),
        },
        { accessToken, refreshToken }
      );

      if (response.ok) {
        const apiResponse = await response.json();

        return res.status(200).json({
          data: apiResponse.data,
          message: "Successfully create company",
        });
      } else {
        const errorData = await response.json();
        return res
          .status(response.status)
          .json({ message: errorData.message || "Failed to create company" });
      }
    } catch (error) {
      console.error("Error authenticating:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
