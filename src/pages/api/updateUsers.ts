import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const {
      id,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      dateOfBirth,
      status,
      contacts,
    } = req.body;

    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        throw new Error("Token not found. Please log in.");
      }

      // Send credentials to external API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/update/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            id,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            dateOfBirth,
            status,
            contacts: [contacts],
          }),
        }
      );

      if (response.ok) {
        const apiResponse = await response.json();
        return res.status(200).json({
          data: apiResponse.data,
          message: "Successfully updated admin",
        });
      } else {
        const errorData = await response.json();
        return res.status(response.status).json({
          message: errorData.message || "Failed to update admin",
        });
      }
    } catch (error) {
      console.error("Error authenticating:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
