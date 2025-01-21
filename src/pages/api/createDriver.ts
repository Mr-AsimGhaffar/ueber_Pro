import { NextApiRequest, NextApiResponse } from "next";
import { fetchWithAuth } from "./refreshToken/refreshAccessToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      dateOfBirth,
      status,
      contacts,
      licenseExpiryDate,
      nic,
      companyId,
    } = req.body;

    try {
      const accessToken = req.cookies.accessToken || "";
      const refreshToken = req.cookies.refreshToken || "";
      // Send credentials to external API
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/drivers`,
        {
          method: "POST",
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            dateOfBirth,
            driverStatus: status,
            contacts: [contacts],
            licenseExpiryDate,
            nic,
            companyId: Number(companyId),
            clientType: "web",
          }),
        },
        { accessToken, refreshToken }
      );

      if (response.ok) {
        const apiResponse = await response.json();

        return res.status(200).json({
          data: apiResponse.data,
          message: "Successfully create driver",
        });
      } else {
        const errorData = await response.json();
        return res
          .status(response.status)
          .json({ message: errorData.message || "Failed to create driver" });
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
